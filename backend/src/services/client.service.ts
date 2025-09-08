import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient";
import { ICreateClientDTO } from "../types/client.types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";
import redisClient from "../config/redis";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@injectable()
export class ClientService {
  async create(userId: number, data: ICreateClientDTO) {
    try {
      const client = await prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
          userId,
          phone: data.phone,
          company: data.company,
          ...(data.tags && {
            tags: {
              connectOrCreate: data.tags.map((tag) => ({
                where: { name_userId: { name: tag.name, userId } },
                create: { name: tag.name, color: tag.color, userId },
              })),
            },
          }),
        },
      });
      return client;
    } catch (err) {
      console.error("Create Client Error:", err);

      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        Array.isArray(err.meta?.target) &&
        err.meta.target.includes("email") &&
        err.meta.target.includes("userId")
      ) {
        throw new AppError({
          message: "A client with this email already exists for your account.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "CLIENT_EMAIL_EXISTS",
          debugMessage: err.message,
        });
      }

      throw new AppError({
        message: "Failed to create client.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "CLIENT_CREATION_FAILED",
        debugMessage: (err as Error)?.message,
      });
    }
  }

  async getAll(options: {
    userId: number;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: "createdAt" | "name" | "email" | "company" | "status";
    sortOrder?: "asc" | "desc";
    categoryIds?: number[]; // filter by categories
    tagIds?: number[]; // filter by tags
    status?: "active" | "inactive" | "prospect"; // active/inactive/prospect
    paymentTermIds?: number[]; // filter by payment terms
    currencyIds?: number[]; // filter by currency
    hasInvoices?: "All" | "yes" | "no";
    noCache?: boolean;
  }) {
    const {
      userId,
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      categoryIds,
      tagIds,
      status,
      paymentTermIds,
      currencyIds,
      hasInvoices = "All",
      noCache = false,
    } = options;

    const offSet = (page - 1) * limit;
    const cacheKey = `clients:${userId}:page:${page}:limit:${limit}:search:${search}:sort:${sortBy}:${sortOrder}:filters:${JSON.stringify(
      {
        categoryIds,
        tagIds,
        status,
        paymentTermIds,
        currencyIds,
        hasInvoices,
      }
    )}`;

    // 🔄 Bypass Redis cache if explicitly requested
    if (!noCache) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    // 🔍 Search condition

    const where: Prisma.ClientWhereInput = {
      userId,

      // 🔍 Search by name, email, or company
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { company: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),

      // 📌 Filter by status
      ...(status ? { status } : {}),

      // 📌 Filter by category
      ...(categoryIds && categoryIds.length > 0
        ? { categoryId: { in: categoryIds } }
        : {}),

      // 📌 Filter by payment terms
      ...(paymentTermIds && paymentTermIds.length > 0
        ? { paymentTermId: { in: paymentTermIds } }
        : {}),

      // 📌 Filter by currency
      ...(currencyIds && currencyIds.length > 0
        ? { currencyId: { in: currencyIds } }
        : {}),

      // 📌 OR filtering for tags (any matching tag is enough ✅)
      ...(tagIds && tagIds.length > 0
        ? {
            tags: {
              some: {
                id: { in: tagIds },
              },
            },
          }
        : {}),

      // 👇 Handle hasInvoices
      ...(hasInvoices === "yes"
        ? { invoices: { some: {} } } // client must have at least one invoice
        : hasInvoices === "no"
        ? { invoices: { none: {} } } // client must have no invoices
        : {}),
    };

    // 📦 Fetch matching clients with relations
    const clients = await prisma.client.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: offSet,
      take: limit,
      include: {
        category: true,
        tags: true,
        paymentTerm: true,
        currency: true,
        notes: true,
        invoices: true,
        Attachment: true,
      },
    });

    // Count total clients for this user (with filters)
    const total = await prisma.client.count({ where });

    // Meta info
    const response = {
      data: clients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message:
        clients.length === 0
          ? "You don't have any clients yet. Start by adding your first one!"
          : null,
    };

    // Cache the result in Redis for 60 seconds
    if (!noCache) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(response));
    }

    return response;
  }

  async getById(id: number, userId: number) {
    const cacheKey = `client:${userId}:${id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return {
        data: JSON.parse(cached),
        meta: {
          source: "cache",
          cachedAt: new Date().toISOString(),
        },
      };
    }
    const client = await prisma.client.findFirst({
      where: { id, userId },
      include: {
        invoices: {
          orderBy: { createdAt: "desc" }, // Optional: newest first
        },
      },
    });

    if (!client) {
      throw new AppError({
        message: "Client not found.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "CLIENT_NOT_FOUND",
        debugMessage: `Client ID: ${id}, User ID: ${userId}`,
      });
    }

    // Cache the client data for 1 hour
    await redisClient.setEx(cacheKey, 60 * 60, JSON.stringify(client));

    return {
      data: client,
      meta: {
        source: "database",
        cached: true,
        cachedAt: new Date().toISOString(),
      },
    };
  }

  async update(id: number, data: any, userId: number) {
    const client = await prisma.client.findFirst({ where: { id, userId } });

    if (!client) {
      throw new AppError({
        message: "Client not found or access denied.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "CLIENT_UPDATE_NOT_ALLOWED",
        debugMessage: `Client ID: ${id}, User ID: ${userId}`,
      });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data,
    });

    // Invalidating Redis cache
    const cacheKey = `client:${userId}:${id}`;
    await redisClient.del(cacheKey);

    // Returning updated data and metadata
    return {
      data: updatedClient,
      meta: {
        cacheInvalidated: true,
        updatedAt: new Date().toISOString(),
      },
    };
  }

  async delete(id: number, userId: number) {
    const client = await prisma.client.findFirst({ where: { id, userId } });

    if (!client) {
      throw new AppError({
        message: "Client not found or access denied.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "CLIENT_DELETE_NOT_ALLOWED",
        debugMessage: `Client ID: ${id}, User ID: ${userId}`,
      });
    }

    const deletedClient = await prisma.client.delete({ where: { id } });
    const clientCacheKey = `client:${userId}:${id}`;
    // const clientListCacheKeyPattern = `clients:${userId}:*`; // if you're caching lists with page/limit

    await redisClient.del(clientCacheKey);

    return {
      data: deletedClient,
      meta: {
        cacheInvalidated: [clientCacheKey],
        deletedAt: new Date().toISOString(),
      },
    };
  }

  async addNoteToClient(userId: number, clientId: number, content: string) {
    return await prisma.clientNote.create({
      data: {
        content,
        client: { connect: { id: clientId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async updateClientNote(userId: number, noteId: number, content: string) {
    // Check if the note exists and belongs to the user
    const existingNote = await prisma.clientNote.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!existingNote) {
      throw new AppError({
        message: "Note not found or access denied.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "NOTE_NOT_FOUND",
      });
    }

    // Validate content
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      throw new AppError({
        message: "Note content must be a non-empty string.",
        statusCode: StatusCodes.BAD_REQUEST,
        code: "INVALID_NOTE_CONTENT",
      });
    }

    return await prisma.clientNote.update({
      where: { id: noteId },
      data: { content },
    });
  }

  async deleteClientNote(userId: number, noteId: number) {
    // Optional: secure with findFirst check
    const note = await prisma.clientNote.findFirst({
      where: {
        id: noteId,
        userId: userId,
      },
    });

    if (!note) {
      throw new AppError({
        message: "Note not found or access denied.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "NOTE_NOT_FOUND",
      });
    }

    return await prisma.clientNote.delete({
      where: { id: noteId },
    });
  }
}
