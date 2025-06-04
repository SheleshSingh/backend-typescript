import app from "./src/app";
import { config } from "./src/config/config";
import connectDb from "./src/config/db";

const startServer = async () => {
  //connect to the database
  await connectDb();
  const port = config.port;

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

startServer();
