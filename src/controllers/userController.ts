/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import userModel from "../models/userModel";

const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(req.body);
    res.json({ user });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
  // const user = await userService.createUser(req.body);
  // res.json({ user });
  // const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   const error = createHttpError(400, "All fields are required");
  //   return next(error);
  // }
  // try {
  //   const user = await userModel.findOne({ email });
  //   if (user) return next(createHttpError(400, "User already exists"));

  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const newUser = await userModel.create({
  //     name,
  //     email,
  //     password: hashedPassword,
  //   });

  //   // token generation jwt
  //   const token = sign({ sub: newUser._id }, config.jwtScret as string, {
  //     expiresIn: "7d",
  //   });

  //   res.json({ accessToken: token });
  // } catch (error) {
  //   return next(createHttpError(500, "Internal Server Error"));
  // }
};

export { createUserHandler };
