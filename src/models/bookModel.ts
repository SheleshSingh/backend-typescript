import mongoose from "mongoose";
import { BookData } from "../../types";
const bookSchema = new mongoose.Schema<BookData>(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genre: { type: String, required: true },
    coverImage: { type: String, required: true },
    file: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
