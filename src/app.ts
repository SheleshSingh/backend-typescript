import express, { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routers/userRouter";
import bookRouter from "./routers/bookRouter";
const app = express();
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use(globalErrorHandler);
export default app;
