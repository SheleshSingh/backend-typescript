import express from "express";
import {
  createBookHandler,
  listBooksHandler,
  updateBookHandler,
} from "../controllers/bookController";
import { upload } from "../middlewares/multer";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBookHandler
);
bookRouter.put(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBookHandler
);
bookRouter.get("/", listBooksHandler);

export default bookRouter;
