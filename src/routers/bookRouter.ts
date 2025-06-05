import express from "express";
import { createBookHandler } from "../controllers/bookController";
import { upload } from "../utils/multer";

const bookRouter = express.Router();

bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBookHandler
);

export default bookRouter;
