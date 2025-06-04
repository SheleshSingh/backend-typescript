import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import createHttpError from "http-errors";

const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ user });
  } catch (error: unknown) {
    if (error instanceof createHttpError.HttpError) {
      next(error);
    } else {
      next(createHttpError(500, "Internal Server Error"));
    }
  }
};

const loginUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.loginUser(req.body);
    res.status(200).json({ user });
  } catch (error: unknown) {
    if (error instanceof createHttpError.HttpError) {
      next(error);
    } else {
      next(createHttpError(500, "Internal Server Error"));
    }
  }
};

export { createUserHandler, loginUserHandler };
