/* eslint-disable @typescript-eslint/no-unused-vars */
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
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
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
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

export { createUserHandler, loginUserHandler };
