import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import { UserRole } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
import status from "http-status";

const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    console.log("🟦 [AUTH] Incoming request:", {
      url: req.originalUrl,
      method: req.method,
    });

    // 1. Extract token
    const token = req.headers?.authorization;

    if (!token) {
      console.log("🟥 [AUTH] No token found in cookies");
      throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
    }

    try {
      console.log("🟨 [AUTH] Verifying token...");

      // 2. Verify token
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      console.log("🟩 [AUTH] Token decoded:", decoded);

      const { role, email } = decoded;

      console.log("🟦 [AUTH] Looking up user:", email);

      // 3. Fetch user
      const user = await User.findOne({ email });

      if (!user) {
        console.log("🟥 [AUTH] User not found in DB");
        throw new AppError(status.NOT_FOUND, "This user is not found!");
      }

      console.log("🟩 [AUTH] User found:", {
        email: user.email,
        role: user.role,
      });

      // 4. Role check
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        console.log("🟥 [AUTH] Role unauthorized:", {
          required: requiredRoles,
          userRole: role,
        });
        throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
      }

      console.log("🟩 [AUTH] Role authorized");

      // 5. Attach user to request
      req.user = decoded as JwtPayload & { role: string };

      console.log("🟩 [AUTH] Auth passed, proceeding → next()");

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.log("🟥 [AUTH] Token expired");
        return next(
          new AppError(
            status.UNAUTHORIZED,
            "Token has expired! Please login again."
          )
        );
      }

      console.log("🟥 [AUTH] Invalid token:", error);
      return next(new AppError(status.UNAUTHORIZED, "Invalid token!"));
    }
  });
};

export default auth;
