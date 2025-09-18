import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";

@injectable()
export class CategoryService {
  // C - create custom category
  async createCategory(userId: number, name: string, color?: string) {
    try {
      return await prisma.clientCategory.create({
        data: {
          name,
          color,
          userId,
          isDefault: false,
        },
      });
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new AppError({
          message: "Category with this name already exists for your account.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "CATEGORY_EXISTS",
          debugMessage: err.message,
        });
      }
      throw new AppError({
        message: "Failed to create category.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "CATEGORY_CREATE_FAILED",
        debugMessage: err.message,
      });
    }
  }

  // R - read (fetch all categories for a user)
  async getCategories(userId: number) {
    try {
      return await prisma.clientCategory.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          color: true,
          isDefault: true,
        },
        orderBy: { id: "asc" },
      });
    } catch (err: any) {
      throw new AppError({
        message: "Failed to fetch categories.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "CATEGORY_FETCH_FAILED",
        debugMessage: err.message,
      });
    }
  }

  // U - update category
  async updateCategory(userId: number, categoryId: number, data: { name?: string; color?: string }) {
    try {
      const category = await prisma.clientCategory.findFirst({
        where: { id: categoryId, userId, isDefault: false },
      });

      if (!category) {
        throw new AppError({
          message: "Category not found or cannot be updated (default categories are protected).",
          statusCode: StatusCodes.NOT_FOUND,
          code: "CATEGORY_NOT_FOUND",
        });
      }

      return await prisma.clientCategory.update({
        where: { id: categoryId },
        data,
      });
    } catch (err: any) {
      throw new AppError({
        message: "Failed to update category.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "CATEGORY_UPDATE_FAILED",
        debugMessage: err.message,
      });
    }
  }

  // D - delete category
  async deleteCategory(userId: number, categoryId: number) {
    try {
      const category = await prisma.clientCategory.findFirst({
        where: { id: categoryId, userId, isDefault: false },
        include: { clients: true },
      });

      if (!category) {
        throw new AppError({
          message: "Category not found or cannot be deleted (default categories are protected).",
          statusCode: StatusCodes.NOT_FOUND,
          code: "CATEGORY_NOT_FOUND",
        });
      }

      if (category.clients.length > 0) {
        throw new AppError({
          message: "Cannot delete category while it is assigned to clients.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "CATEGORY_IN_USE",
        });
      }

      return await prisma.clientCategory.delete({
        where: { id: categoryId },
      });
    } catch (err: any) {
      throw new AppError({
        message: "Failed to delete category.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "CATEGORY_DELETE_FAILED",
        debugMessage: err.message,
      });
    }
  }
}
