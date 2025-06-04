import { NextFunction, Request, Response } from "express";
import * as bookService from "../services/bookService";
import createHttpError from "http-errors";

const createBookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(createHttpError(409, error.message));
    } else {
      return next(createHttpError(500, "Internal Server Error"));
    }
  }
};

export { createBookHandler };
