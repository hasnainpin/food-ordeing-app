import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import myUserRoute from "./routes/myUserRoute";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_CONNECTION as string)
  .then(() => console.log("connected to database"));
const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health ok!" });
});

app.use("/api", myUserRoute);
app.listen(5000, () => {
  console.log("server start localhost:5000");
});
