import createHttpError from "http-errors";
import { BookData } from "../../types";
import bookModel from "../models/bookModel";
import cloudinary from "../config/cloudinary";
import path from "path";
// import fs from "fs/promises";

export const createBook = async (data: BookData) => {
  // Check duplicate
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
    console.log("Book file upload result:", bookFileUploadResult);
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

  // Upload content file to cloudinary (if you want to upload book content, else store locally or as you wish)
  // const contentFilePath = path.join(
  //   __dirname,
  //   "../../public/data/uploads",
  //   contentFile.filename
  // );

  // const contentUploadResult = await cloudinary.uploader.upload(
  //   contentFilePath,
  //   {
  //     folder: "book-contents",
  //     resource_type: "raw",
  //     public_id: path.parse(contentFile.filename).name,
  //   }
  // );

  // Delete local files after upload
  // await fs.unlink(coverImagePath);
  // await fs.unlink(contentFilePath);

  // Create book record with URLs from Cloudinary
};
