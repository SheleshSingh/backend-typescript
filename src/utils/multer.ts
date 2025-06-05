import multer from "multer";
import path from "node:path";
export const upload = multer({
  dest: path.join(__dirname, "../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30 MB
});
