import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import bookRouter from "./routers/bookRouter";
import userRouter from "./routers/userRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontentDomain,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// This must be the **last** middleware
app.use(globalErrorHandler);

export default app;
