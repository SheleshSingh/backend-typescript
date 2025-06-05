import { Types } from "mongoose";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  password: string;
}
export interface BookData {
  id: string;
  title: string;
  author: Types.ObjectId;
  genre: string;
  coverImage: Express.Multer.File | string;
  file: Express.Multer.File | string;
}
