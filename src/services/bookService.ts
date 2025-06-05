import createHttpError from "http-errors";
import { BookData } from "../../types";
import bookModel from "../models/bookModel";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs/promises";

export const createBook = async (data: BookData) => {
  // Check duplicate
  const existingBook = await bookModel.findOne({ title: data.title });
  if (existingBook) throw createHttpError(409, "Book already exists");

  // Expecting data.coverImage and data.file to be Express.Multer.File objects (single files)
  const coverImageFile = data.coverImage as Express.Multer.File;
  const contentFile = data.file as Express.Multer.File;

  if (!coverImageFile)
    throw createHttpError(400, "Cover image file is missing");
  if (!contentFile) throw createHttpError(400, "Content file is missing");

  // Upload cover image to cloudinary
  const coverImagePath = path.join(
    __dirname,
    "../../public/data/uploads",
    coverImageFile.filename
  );
  const coverImageMime = coverImageFile.mimetype.split("/").pop() || "jpg";

  const coverUploadResult = await cloudinary.uploader.upload(coverImagePath, {
    folder: "book-covers",
    resource_type: "image",
    format: coverImageMime,
    public_id: path.parse(coverImageFile.filename).name,
  });

  // Upload content file to cloudinary (if you want to upload book content, else store locally or as you wish)
  const contentFilePath = path.join(
    __dirname,
    "../../public/data/uploads",
    contentFile.filename
  );

  const contentUploadResult = await cloudinary.uploader.upload(
    contentFilePath,
    {
      folder: "book-contents",
      resource_type: "raw",
      public_id: path.parse(contentFile.filename).name,
    }
  );

  // Delete local files after upload
  await fs.unlink(coverImagePath);
  await fs.unlink(contentFilePath);

  // Create book record with URLs from Cloudinary
  const newBook = await bookModel.create({
    ...data,
    coverImage: coverUploadResult.secure_url,
    file: contentUploadResult.secure_url,
  });

  return newBook;
};
