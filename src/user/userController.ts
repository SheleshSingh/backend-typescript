import { Request, Response } from "express";

const createUser = (_req: Request, res: Response) => {
  res.json({ message: "User registered successfully!" });
};
export { createUser };
