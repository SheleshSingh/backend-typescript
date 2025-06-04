import express from "express";
import { createBookHandler } from "../controllers/bookController";

const bookRouter = express.Router();

bookRouter.post("/", createBookHandler);

export default bookRouter;
