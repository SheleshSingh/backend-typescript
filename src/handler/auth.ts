import { Request, Response } from "express";

const authHandler = (req: Request, res: Response) => {
  if (req.method === "POST") {
    // Handle login logic here
    const { username, password } = req.body;
    // Validate credentials (this is just a placeholder)
    if (username === "admin" && password === "password") {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authHandler;
