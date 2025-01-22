import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import myUserRoute from "./routes/myUserRoute";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/myRestaurantRoute";
import restaurantRoute from "./routes/restaurantRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION as string)
  .then(() => console.log("connected to database"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(express.json());
app.use(cors());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health ok!" });
});

app.use("/api", myRestaurantRoute);
app.use("/api", myUserRoute);
app.use("/api", restaurantRoute);

app.get("/home", (req, res) => {
  res.send("homepage");
});

app.listen(5000, () => {
  console.log("server start localhost:5000");
});
