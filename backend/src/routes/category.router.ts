import { Router, Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { CategoryController } from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth/auth.middleware";
import { wrapWithAuthRequest } from "../utils/wrapWithAuthRequest";

@injectable()
export class CategoryRouter {
  public router: Router;
  constructor(
    @inject(TYPES.CategoryController)
    private categoryController: CategoryController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create category
    this.router.post(
      "/",
      authenticate,
      wrapWithAuthRequest(
        this.categoryController.createCategory.bind(this.categoryController)
      )
    );

    // Get all categories
    this.router.get(
      "/",
      authenticate,
      wrapWithAuthRequest(
        this.categoryController.getCategories.bind(this.categoryController)
      )
    );

    // Update category
    this.router.patch(
      "/:id",
      authenticate,
      wrapWithAuthRequest(
        this.categoryController.updateCategory.bind(this.categoryController)
      )
    );

    // Delete category
    this.router.delete(
      "/:id",
      authenticate,
      wrapWithAuthRequest(
        this.categoryController.deleteCategory.bind(this.categoryController)
      )
    );
  }
}
