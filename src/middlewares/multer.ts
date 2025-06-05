import multer from "multer";
import path from "path";

const uploadPath = path.join(__dirname, "../../public/data/uploads");

export const upload = multer({
  dest: uploadPath,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
