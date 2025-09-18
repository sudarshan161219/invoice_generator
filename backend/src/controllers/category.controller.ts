import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { CategoryService } from "../services/category.service";
import { AuthRequest } from "../types/express";
import { AppError } from "../errors/AppError";
import { TYPES } from "../types/types";

@injectable()
export class CategoryController {
  constructor(
    @inject(TYPES.CategoryService) private categoryService: CategoryService
  ) {}

  async createCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { name, color } = req.body;

      if (!name) {
        throw new AppError({
          message: "Category name is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "CATEGORY_NAME_REQUIRED",
        });
      }
      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }

      const category = await this.categoryService.createCategory(
        userId,
        name,
        color
      );
      res.status(StatusCodes.CREATED).json(category);
    } catch (err) {
      next(err);
    }
  }

  // GET /categories
  async getCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }
      const categories = await this.categoryService.getCategories(userId);
      res.status(StatusCodes.OK).json(categories);
    } catch (err) {
      next(err);
    }
  }

  // PATCH /categories/:id
  async updateCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const categoryId = Number(req.params.id);
      const { name, color } = req.body;

      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }

      const updated = await this.categoryService.updateCategory(
        userId,
        categoryId,
        { name, color }
      );
      res.status(StatusCodes.OK).json(updated);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /categories/:id
  async deleteCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const categoryId = Number(req.params.id);

      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }

      await this.categoryService.deleteCategory(userId, categoryId);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}
