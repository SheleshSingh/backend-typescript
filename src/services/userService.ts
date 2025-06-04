import { sign } from "jsonwebtoken";
import { UserData } from "../../types";
import { config } from "../config/config";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";

export const createUser = async (data: UserData) => {
  const user = await userModel.findOne({ email: data.email });
  if (user) throw new Error("User already exists");

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await userModel.create({ ...data, password: hashedPassword });

  // Token generation using JWT
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });
  return { accessToken: token };
};
