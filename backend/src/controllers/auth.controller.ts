import { injectable, inject } from "inversify";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { TYPES } from "../types/types";
import { AppError } from "../errors/AppError";
import { AuthRequest } from "../types/express";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  async handleRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.register(req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user, rememberMe } = await this.authService.login(
        req.body
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
      });
      res.status(StatusCodes.OK).json({
        user,
        ...(process.env.NODE_ENV !== "production" && { token }),
      });
    } catch (error) {
      next(error);
    }
  }

  async handleLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(StatusCodes.NO_CONTENT).send(); // Nothing to do
      }

      // Clear the token cookie
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      const result = await this.authService.logout(token);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleMe(req: AuthRequest, res: Response, next: NextFunction) {
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

      const user = await this.authService.me(userId);
      res.status(StatusCodes.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleUpdate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const data = req.body;
      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }

      const user = await this.authService.update(userId, data);
      res.status(StatusCodes.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      if (!email) {
        throw new AppError({
          message: "Email is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "EMAIL_REQUIRED",
        });
      }
      await this.authService.forgot_password(email);

      res.status(StatusCodes.OK).json({
        success: true,
        message:
          "If the email is registered, a reset link has been sent. Check your inbox and spam.",
      });
    } catch (error) {
      next(error);
    }
  }

  async handleResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, token } = req.body;

      if (!token) {
        throw new AppError({
          message: "Token is missing.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "TOKEN_MISSING",
        });
      }
      if (!password) {
        throw new AppError({
          message: "New password is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "PASSWORD_REQUIRED",
        });
      }
      await this.authService.reset_password(token, password);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Password reset successful.",
      });
    } catch (error) {
      next(error);
    }
  }

  async oauthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as { id: number; email: string };

      const token = await this.authService.generateOAuthToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const html = `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: "oauth-success",
              token: "${token}"
            }, "*");
            window.close();
          </script>
        </body>
      </html>
    `;

      res.send(html);
    } catch (error) {
      next(error);
      const message =
        error instanceof AppError ? error.message : "OAuth failed";
      const html = `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: "oauth-error",
              message: "${message}"
            }, "*");
            window.close();
          </script>
        </body>
      </html>
    `;

      res.send(html);
    }
  }

  async googleAuthAPI(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, mode } = req.body;

      if (!code || !mode) {
        return res.status(400).json({ message: "Missing idToken or mode" });
      }
      const token = await this.authService.handleGoogleAuth({ code, mode });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCodes.OK).json({
        ...(process.env.NODE_ENV !== "production" && { token, success: true }),
      });
    } catch (error) {
      next(error);
    }
  }

  // auth.controller.ts
  async githubAuthAPI(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, mode } = req.body;

      if (!code || !mode) {
        return res.status(400).json({ message: "Missing code or mode" });
      }

      const token = await this.authService.handleGitHubAuth({ code, mode });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCodes.OK).json({
        ...(process.env.NODE_ENV !== "production" && { token, success: true }),
      });
    } catch (err) {
      next(err);
    }
  }
}
