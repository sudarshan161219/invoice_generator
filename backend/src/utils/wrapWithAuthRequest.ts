import { AuthRequest } from "../types/express";
import { Request, Response, NextFunction } from "express";

const wrapWithAuthRequest =
  (
    handler: (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req as AuthRequest, res, next);

export { wrapWithAuthRequest };
