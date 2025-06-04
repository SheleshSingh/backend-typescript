import express from "express";
import { createUserHandler, loginUserHandler } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", createUserHandler);
userRouter.post("/login", loginUserHandler);

export default userRouter;
