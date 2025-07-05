import { Router, Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { validationResult } from "express-validator";
import { AuthController } from "../controllers/auth.controller";
import { TYPES } from "../types/types";
import passport from "passport";
import { AuthRequest } from "../types/express";
import { wrapWithAuthRequest } from "../utils/wrapWithAuthRequest";

import {
  registerValidator,
  loginValidator,
  forgot_password_Validator,
  reset_password_Validator,
} from "../validators/auth.validator";
import { authenticate } from "../middlewares/auth/auth.middleware";
import { AppError } from "../errors/AppError";

@injectable()
export class AuthRouter {
  public router: Router;

  constructor(
    @inject(TYPES.AuthController) private authController: AuthController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      registerValidator,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleRegister(req, res, next);
      }
    );

    this.router.post(
      "/login",
      loginValidator,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleLogin(req, res, next);
      }
    );

    this.router.post(
      "/logout",
      authenticate,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        await this.authController.handleLogout(req, res, next);
      }
    );

    this.router.get(
      "/me",
      authenticate,
      wrapWithAuthRequest(
        this.authController.handleMe.bind(this.authController)
      )
    );

    this.router.get(
      "/update",
      authenticate,
      wrapWithAuthRequest(
        this.authController.handleUpdate.bind(this.authController)
      )
    );

    this.router.post(
      "/forgot-password",
      forgot_password_Validator,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleForgotPassword(req, res, next);
      }
    );

    this.router.post(
      "/reset-password",
      reset_password_Validator,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(errors.array());
        }
        return this.authController.handleResetPassword(req, res, next);
      }
    );

    this.router.post("/google", (req, res, next) => {
      this.authController.googleAuthAPI(req, res, next);
    });

    this.router.get(
      "/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/fail",
        session: false,
      }),
      async (req, res, next) => {
        return this.authController.oauthCallback(req, res, next);
      }
    );

    this.router.post("/github", (req, res, next) => {
      this.authController.githubAuthAPI(req, res, next);
    });

    // GitHub callback
    this.router.get(
      "/github/callback",
      passport.authenticate("github", {
        failureRedirect: "/login",
        session: false,
      }),
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.oauthCallback(req, res, next)
    );
  }
}
