import express from "express";
import { createUserHandler } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", createUserHandler);

export default userRouter;
