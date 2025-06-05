import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) return next(createHttpError(401, "Unauthorized access"));
  try {
    const parseToken = token.split(" ")[1];
    const decodedToken = jwt.verify(parseToken, config.jwtSecret as string);
    if (!decodedToken) {
      return next(createHttpError(401, "Unauthorized access"));
    }
    const _req = req as AuthRequest;
    _req.userId = decodedToken.sub as string;
    next();
  } catch (error) {
    throw next(
      createHttpError(401, "Unauthorized access", {
        cause: error,
      })
    );
  }
};

export default authenticate;
