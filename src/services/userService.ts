import { sign } from "jsonwebtoken";
import { UserData } from "../../types";
import { config } from "../config/config";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export const createUser = async (data: UserData) => {
  const user = await userModel.findOne({ email: data.email });
  if (user) return createHttpError(409, "User already exists");

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await userModel.create({ ...data, password: hashedPassword });

  // Token generation using JWT
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });
  return { accessToken: token };
};

export const loginUser = async (data: UserData) => {
  const user = await userModel.findOne({ email: data.email });
  if (!user) return createHttpError(404, "User not found");
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) return createHttpError(401, "Invalid password");

  // Token generation using JWT
  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });
  return { accessToken: token };
};
