import axios from "axios";
import { injectable } from "inversify";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { IRegisterDTO, ILoginDTO, UpdateUserDTO } from "../types/auth.types";
import { prisma } from "../utils/prismaClient";
import { AppError } from "../errors/AppError";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redis";
import crypto from "crypto";
import { hashToken } from "../utils/hash";
import { sendEmail } from "../utils/sendEmail";
import { JwtUserPayload } from "../types/auth.types";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

@injectable()
export class AuthService {
  async register(data: IRegisterDTO) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new AppError({
          message: "Email already in use.",
          statusCode: StatusCodes.CONFLICT,
          code: "EMAIL_CONFLICT",
          debugMessage: `Attempted to register with existing email: ${data.email}`,
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: { name: data.name, email: data.email, password: hashedPassword },
      });

      return { message: "User registered", user };
    } catch (error) {
      if (error instanceof AppError) {
        throw error; // keep the original "Email already in use." message
      }

      throw new AppError({
        message: "Registration failed. Please try again.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "REGISTRATION_FAILED",
        debugMessage: "Unexpected error in AuthService.register",
        cause: error as Error,
      });
    }
  }

  async login(data: ILoginDTO) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        // select: { id: true, name: true, email: true, password: true },
      });

      if (!user) {
        throw new AppError({
          message: "Incorrect email or password.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "INVALID_CREDENTIALS",
          debugMessage: `No user found with email: ${data.email}`,
        });
      }

      if (!user.password) {
        throw new AppError({
          message: "Invalid credentials.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "INVALID_CREDENTIALS",
          debugMessage: `User exists but has no password set.`,
        });
      }

      const isMatch = await bcrypt.compare(data.password, user.password);

      if (!isMatch) {
        throw new AppError({
          message: "Incorrect email or password.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "INVALID_CREDENTIALS",
          debugMessage: `Password mismatch for email: ${data.email}`,
        });
      }
      const jti = uuidv4(); // generates unique token ID
      const token = jwt.sign({ id: user.id, jti }, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      const { id, name, email } = user;
      const { rememberMe } = data;
      return {
        token,
        jti, // returns jti so logout can use it
        user: { id, name, email },
        rememberMe,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: "Login failed. Please try again.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "LOGIN_FAILED",
        debugMessage: "Unexpected error in AuthService.login",
        cause: error as Error,
      });
    }
  }

  async logout(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;

      const jti = decoded.jti;
      const exp = decoded.exp;

      if (!jti || !exp) {
        throw new AppError({
          message: "Invalid token structure",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "INVALID_TOKEN",
          debugMessage: "Missing jti or exp in token payload",
        });
      }

      const currentTime = Math.trunc(Date.now() / 1000);
      const ttlInSeconds = exp - currentTime;

      if (ttlInSeconds > 0) {
        await redisClient.setEx(`blackList:${jti}`, ttlInSeconds, "true");
      }

      return { message: "User logged out successfully" };
    } catch (error) {
      throw new AppError({
        message: "Logout failed.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "LOGOUT_FAILED",
        debugMessage: "Failed to blacklist token in Redis",
        cause: error as Error,
      });
    }
  }

  async me(userId: number) {
    try {
      const cacheKey = `user:${userId}`;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true },
      });

      if (!user) {
        throw new AppError({
          message: "Session expired. Please log in again.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "USER_NOT_FOUND",
          debugMessage: `No user found with ID: ${userId}`,
        });
      }

      // 3. Cache result in Redis for 25 minutes (1500 seconds)
      await redisClient.setEx(cacheKey, 1500, JSON.stringify(user));

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: "Failed to fetch user info.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "ME_FAILED",
        debugMessage: "Unexpected error in AuthService.me",
        cause: error as Error,
      });
    }
  }

  async update(userId: number, data: UpdateUserDTO) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      // Invalidate cache
      await redisClient.del(`user:${userId}`);

      return updatedUser;
    } catch (error) {
      throw new AppError({
        message: "Failed to update user.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "USER_UPDATE_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async forgot_password(email: string) {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = hashToken(token);
      const expiry = new Date(Date.now() + 15 * 60 * 1000);

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new AppError({
          message: "User not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "USER_NOT_FOUND",
        });
      }

      await prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: new Date(expiry),
        },
      });

      const resetURL = `http://localhost:5173/reset-password?token=${token}`;
      const subject = "Reset your password?";
      const html = `
  <p>You requested a password reset.</p>
  <p>Click the link below to reset your password. This link will expire in 15 minutes:</p>
  <a href="${resetURL}">Reset your password</a>
`;

      await sendEmail(email, subject, html);
    } catch (error) {
      throw new AppError({
        message: "Failed to process forgot password.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "FORGOT_PASSWORD_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async reset_password(token: string, password: string) {
    try {
      const hashedToken = hashToken(token);

      const user = await prisma.user.findFirst({
        where: {
          passwordResetExpires: { gte: new Date() },
          passwordResetToken: hashedToken,
        },
      });

      if (!user) {
        throw new AppError({
          message: "Token is invalid or expired.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "TOKEN_INVALID",
        });
      }

      // 2. Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      const subject = "Your password was successfully changed";
      const html = `
  <p>Hello,</p>

  <p>This is a confirmation that your password was successfully changed.</p>

  <p>If you did not make this change, please <a href="https://yourapp.com/support">contact our support team</a> immediately.</p>

  <p>Thank you,<br />The YourApp Team</p>
`;

      await sendEmail(user.email, subject, html);
    } catch (error) {
      throw new AppError({
        message: "Failed to process reset password.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "RESET_PASSWORD_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async generateOAuthToken(user: { id: number; email: string }) {
    try {
      const jti = uuidv4();

      const payload: JwtUserPayload = {
        id: user.id,
        email: user.email,
        jti,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      await redisClient.set(`session:${jti}`, JSON.stringify(payload));

      return token;
    } catch (error) {
      throw new AppError({
        message: "Failed to generate OAuth token.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "OAUTH_TOKEN_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async verifyGoogleToken(idToken: string) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || "Google User";
    const profileImage = payload?.picture || "";

    if (!email) {
      throw new AppError({
        message: "No email in Google profile",
        statusCode: 400,
      });
    }

    return { email, name, profileImage };
  }

  async exchangeCodeForIdToken(code: string): Promise<string> {
    try {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage", // required for auth-code flow from SPA
        grant_type: "authorization_code",
      });

      const idToken = response.data.id_token;

      if (!idToken) {
        throw new AppError({
          message: "Failed to retrieve ID token from Google",
          statusCode: 400,
        });
      }

      return idToken;
    } catch (error: any) {
      throw new AppError({
        message: "Error exchanging code for token",
        statusCode: 400,
        debugMessage: error?.response?.data?.error_description || error.message,
      });
    }
  }

  async handleGoogleAuth({
    code,
    mode,
  }: {
    code: string;
    mode: "login" | "register";
  }) {
    // ✅ Step 1: Exchange code for ID token
    const idToken = await this.exchangeCodeForIdToken(code);

    // ✅ Step 2: Verify and extract user info from ID token
    const { email, name, profileImage } = await this.verifyGoogleToken(idToken);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (mode === "login") {
      if (!existingUser) {
        throw new AppError({
          message: "User not found. Please register.",
          statusCode: 401,
        });
      }
      return this.generateOAuthToken(existingUser);
    }

    if (mode === "register") {
      if (existingUser) {
        throw new AppError({
          message: "User already exists. Please log in.",
          statusCode: 400,
        });
      }

      const newUser = await prisma.user.create({
        data: { name, email, profileImage },
      });

      return this.generateOAuthToken(newUser);
    }

    throw new AppError({ message: "Invalid mode", statusCode: 400 });
  }

  async handleGitHubAuth({
    code,
    mode,
  }: {
    code: string;
    mode: "login" | "register";
  }) {
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = data.access_token;
    if (!accessToken) {
      throw new AppError({
        message: "GitHub token exchange failed",
        statusCode: 400,
      });
    }

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = emailRes.data.find((e: any) => e.primary)?.email;
    const name = userRes.data.name || userRes.data.login;
    const profileImage = userRes.data.avatar_url;

    if (!email) {
      throw new AppError({ message: "No email found", statusCode: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (mode === "login") {
      if (!existingUser) {
        throw new AppError({ message: "User not found", statusCode: 401 });
      }

      return this.generateOAuthToken(existingUser);
    }

    if (mode === "register") {
      if (existingUser) {
        throw new AppError({ message: "User already exists", statusCode: 400 });
      }

      const newUser = await prisma.user.create({
        data: { name, email, profileImage },
      });

      return this.generateOAuthToken(newUser);
    }

    throw new AppError({ message: "Invalid mode", statusCode: 400 });
  }
}
