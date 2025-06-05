import express from "express";
import { createBookHandler } from "../controllers/bookController";
import { upload } from "../middlewares/multer";

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

// import express from "express";
// import { upload } from "../middlewares/multer";
// import { createBookHandler } from "../controllers/bookController";

// const bookRouter = express.Router();

// bookRouter.post(
//   "/",
//   upload.fields([
//     { name: "coverImage", maxCount: 1 },
//     { name: "file", maxCount: 1 },
//   ]),
//   (req, res, next) => {
//     Promise.resolve(createBookHandler(req, res, next)).catch(next);
//   }
// );

// export default bookRouter;
