import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "../utils/prismaClient";
import { VerifyCallback } from "passport-oauth2";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as GitHubProfile } from "passport-github2";
import { AppError } from "../errors/AppError";

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: number, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true, // 👈 important
    },
    async (req, _, __, profile, done) => {
      console.log("✅ GoogleStrategy triggered");
      const email = profile.emails?.[0]?.value || "";
      const state = req.query.state; // 👈 now you have access to login/register

      if (!email) {
        return done(
          new AppError({
            message: "Google account has no email",
            statusCode: 400,
            code: "GOOGLE_NO_EMAIL",
          })
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (state === "login") {
        if (!existingUser) {
          return done(
            new AppError({
              message: "User not found. Please register first.",
              statusCode: 401,
              code: "OAUTH_USER_NOT_FOUND",
            })
          );
        }
        return done(null, { id: existingUser.id, email: existingUser.email });
      }

      if (state === "register") {
        if (existingUser) {
          return done(
            new AppError({
              message: "User already registered. Please log in.",
              statusCode: 400,
              code: "OAUTH_USER_EXISTS",
            })
          );
        }

        const newUser = await prisma.user.create({
          data: {
            name: profile.displayName,
            email,
            profileImage: profile.photos?.[0]?.value || "",
          },
        });

        return done(null, { id: newUser.id, email: newUser.email });
      }

      // Fallback
      return done(null, false);
    }
  )
);

// GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "/api/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback
    ): Promise<void> => {
      const email =
        profile.emails?.[0]?.value || `${profile.username}@github.com`;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) return done(null, existingUser);

      const user = await prisma.user.create({
        data: {
          name: profile.displayName,
          email,
          profileImage: profile.photos?.[0]?.value || "",
        },
      });

      done(null, user);
    }
  )
);

export const configuredPassport = passport;
