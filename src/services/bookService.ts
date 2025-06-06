import createHttpError from "http-errors";
import { BookData } from "../../types";
import bookModel from "../models/bookModel";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs/promises";

export const createBook = async (data: BookData) => {
  const book = await bookModel.findOne({ title: data.title });
  if (book) throw createHttpError(409, "Book already exists");

  const coverImageFile = data.coverImage as Express.Multer.File;
  const contentFile = data.file as Express.Multer.File;
  if (!coverImageFile)
    throw createHttpError(400, "Cover image file is missing");
  if (!contentFile) throw createHttpError(400, "Content file is missing");
  const filePath = path.join(
    __dirname,
    "../../public/data/uploads",
    coverImageFile.filename
  );
  try {
    const coverImageMime = coverImageFile.mimetype.split("/").pop() || "jpg";
    const coverUploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "book-covers",
      resource_type: "image",
      format: coverImageMime,
      public_id: path.parse(coverImageFile.filename).name,
    });
    const bookFileName = contentFile.filename;
    const bookFilePath = path.join(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdf",
        formate: "pdf",
      }
    );

    await fs.unlink(filePath);
    await fs.unlink(bookFilePath);

    const newBook = await bookModel.create({
      ...data,
      coverImage: coverUploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });
    return newBook;
  } catch (error) {
    throw createHttpError(500, "Error uploading files", {
      cause: error,
    });
  }
};

export const updateBookHandler = async (bookId: string, data: BookData) => {
  const book = await bookModel.findOne({ _id: bookId });
  if (!book) throw createHttpError(404, "Book not found");

  if (!data.author || !book.author)
    throw createHttpError(400, "Author information is required");

  if (data.author.toString() !== book.author.toString()) {
    throw createHttpError(403, "You are not authorized to update this book");
  }
  const coverImageFile = data.coverImage as Express.Multer.File;
  const contentFile = data.file as Express.Multer.File;
  if (!coverImageFile && !contentFile) {
    throw createHttpError(400, "No files provided for update");
  }

  const updateData: Partial<BookData> = {};
  if (coverImageFile) {
    updateData.coverImage = coverImageFile;
  }
  if (contentFile) {
    updateData.file = contentFile;
  }

  await bookModel.updateOne({ _id: bookId }, { $set: updateData });
  const updatedBook = await bookModel.findOne({ _id: bookId });
  return updatedBook;
};

export const getAllBooks = async () => {
  const books = await bookModel.find();
  if (!books || books.length === 0)
    throw createHttpError(404, "No books found");
  return books;
};

export const getSingleBook = async (data: BookData) => {
  const book = await bookModel.findOne({ _id: data.id });
  if (!book) throw createHttpError(404, "Book not found");

  return book;
};
export const deleteBook = async (data: BookData) => {
  const book = await bookModel.findOne({ _id: data.id });
  if (!book) throw createHttpError(404, "Book not found");
  if (!book.coverImage) {
    throw createHttpError(400, "Book cover image is missing");
  }
  const coverImageStr =
    typeof book.coverImage === "string" ? book.coverImage : "";
  const coverFileSplits = coverImageStr.split("/");
  const coverImagePublicId =
    (coverFileSplits.at(-2) ?? "") +
    "/" +
    (coverFileSplits.at(-1)?.split(".").at(-2) ?? "");
  const bookFileSplits =
    typeof book.file === "string" ? book.file.split("/") : [];
  const bookFilePublicId =
    (bookFileSplits.at(-2) ?? "") +
    "/" +
    (bookFileSplits.at(-1)?.split(".").at(-1) ?? "");
  await cloudinary.uploader.destroy(coverImagePublicId, {
    resource_type: "image",
  });
  await cloudinary.uploader.destroy(bookFilePublicId, {
    resource_type: "raw",
  });
  await bookModel.deleteOne({ _id: data.id });
  return book;
};
