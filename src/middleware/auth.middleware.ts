import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verifyToken,
} from "../utils/jwt";

export const authenticate =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader =
        req.headers.authorization;

      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "No token provided",
          });
      }

      const token =
        authHeader.split(" ")[1];

      const decoded =
        verifyToken(token);
      console.log("DECODED =", decoded);
      req.user = decoded;

      next();
    } catch {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Invalid token",
        });
    }
  };