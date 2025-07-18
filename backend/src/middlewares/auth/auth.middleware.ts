import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import redisClient from "../../config/redis";
import { JwtUserPayload, AuthRequest } from "../../types/auth.types";
import { asyncHandler } from "./asyncHandler";

export const authenticate = asyncHandler<AuthRequest>(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      return next(
        new AppError({
          message: "Access denied. No authentication token provided.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "AUTH_TOKEN_MISSING",
        })
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtUserPayload;

    const isBlacklisted = await redisClient.get(`blacklist:${decoded.jti}`);

    if (isBlacklisted) {
      return next(
        new AppError({
          message: "This token has been revoked. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "AUTH_TOKEN_BLACKLISTED",
        })
      );
    }
    (req as AuthRequest).user = decoded;
    next();
  }
);
