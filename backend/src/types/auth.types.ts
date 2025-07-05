import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface IRegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface JwtUserPayload {
  id: number;
  email: string;
  role?: string;
  jti: string;
  exp?: number;
  iat?: number;
  // token?: string;
}

export interface jwtToken {
  token?: string;
}

// Corrected AuthRequest type
export interface AuthRequest<
  Params = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: JwtUserPayload;
  // cookies?: jwtToken;
}
