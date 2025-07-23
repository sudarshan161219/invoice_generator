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

export interface AuthFileRequest extends Request {
  user?: JwtUserPayload;
  file?: Express.Multer.File;
  body: {
    filename?: string;
    clientId?: string;
    invoiceId?: string;
    type?: string;
  };
}
