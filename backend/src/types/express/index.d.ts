import { JwtUserPayload } from "../auth.types";


import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}
