import createHttpError from "http-errors";
import { BookData } from "../../types";
import bookModel from "../models/bookModel";

export const createBook = async (data: BookData) => {
  const book = await bookModel.findOne({ title: data.title });
  if (book) return createHttpError(409, "Book already exists");

  const newBook = await bookModel.create(data);
  return newBook;
};
