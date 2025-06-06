import { NextFunction, Request, Response } from "express";
import * as bookService from "../services/bookService";
import createHttpError from "http-errors";

const createBookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as
      | {
          coverImage?: Express.Multer.File[];
          file?: Express.Multer.File[];
        }
      | undefined;
    if (!files?.coverImage?.[0]) {
      throw createHttpError(400, "Cover image file is required.");
    }
    if (!files?.file?.[0]) {
      throw createHttpError(400, "Book content file is required.");
    }
    const coverImageFile = files?.coverImage?.[0];
    const contentFile = files?.file?.[0];

    if (!coverImageFile) {
      throw createHttpError(400, "Cover image file is required.");
    }

    if (!contentFile) {
      throw createHttpError(400, "Book content file is required.");
    }

    const book = await bookService.createBook({
      ...req.body,
      coverImage: coverImageFile,
      file: contentFile,
    });

    res.status(201).json(book);
  } catch (error: unknown) {
    console.error("Create Book Error:", error);
    if (error instanceof Error) {
      return next(createHttpError(409, error.message));
    } else {
      return next(createHttpError(500, "Internal Server Error"));
    }
  }
};

const updateBookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as
      | {
          coverImage?: Express.Multer.File[];
          file?: Express.Multer.File[];
        }
      | undefined;
    if (!files?.coverImage?.[0]) {
      throw createHttpError(400, "Cover image file is required.");
    }
    if (!files?.file?.[0]) {
      throw createHttpError(400, "Book content file is required.");
    }
    const coverImageFile = files?.coverImage?.[0];
    const contentFile = files?.file?.[0];

    if (!coverImageFile) {
      throw createHttpError(400, "Cover image file is required.");
    }

    if (!contentFile) {
      throw createHttpError(400, "Book content file is required.");
    }

    const book = await bookService.updateBookHandler(req.params.bookId, {
      ...req.body,
      coverImage: coverImageFile,
      file: contentFile,
    });

    res.status(200).json(book);
  } catch (error: unknown) {
    console.error("Update Book Error:", error);
    if (error instanceof Error) {
      return next(createHttpError(409, error.message));
    } else {
      return next(createHttpError(500, "Internal Server Error"));
    }
  }
};

const listBooksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json({ books });
  } catch (error: unknown) {
    console.error("List Books Error:", error);
    if (error instanceof Error) {
      return next(createHttpError(409, error.message));
    } else {
      return next(createHttpError(500, "Internal Server Error"));
    }
  }
};

export { createBookHandler, updateBookHandler, listBooksHandler };
