import { Request, Response } from "express";
import Restaurant from "../Models/rastaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
export interface CustomRequest extends Request {
  userId?: string;
}
const createMyRestaurant = async (req: CustomRequest, res: Response) => {
  try {
    console.log("create api");
    const existingRestaurant = await Restaurant.findOne({
      user: req.userId,
    });
    console.log("menuItem: ", req.body.menuItem);
    if (existingRestaurant) {
      res.status(409).json({ message: "user restaurant already exists  " });
      return;
    }
    // const image = req.file as Express.Multer.File;
    // const base64Image = Buffer.from(image.buffer).toString("base64");
    // const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    const imageUrl = await updateImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error: any) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
const updateImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

const getMyRestaurant = async (req: CustomRequest, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "restaurant not found" });
      return;
    }
    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error get restaurant" });
  }
};
const updateMyRestaurant = async (req: CustomRequest, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "restaurant not found " });
    }
    (restaurant as NonNullable<typeof restaurant>).restaurantName =
      req.body.restaurantName;
    (restaurant as NonNullable<typeof restaurant>).city = req.body.city;
    (restaurant as NonNullable<typeof restaurant>).country = req.body.country;
    (restaurant as NonNullable<typeof restaurant>).deliveryPrice =
      req.body.deliveryPrice;
    (restaurant as NonNullable<typeof restaurant>).estimatedDeliveryTime =
      req.body.estimatedDeliveryTime;
    (restaurant as NonNullable<typeof restaurant>).cuisine = req.body.cuisine;
    (restaurant as NonNullable<typeof restaurant>).menuItem = req.body.menuItem;
    (restaurant as NonNullable<typeof restaurant>).lastUpdated = new Date();
    if (req.file) {
      const imageUrl = await updateImage(req.file as Express.Multer.File);
      (restaurant as NonNullable<typeof restaurant>).imageUrl = imageUrl;
    }

    await (restaurant as NonNullable<typeof restaurant>).save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "error update restaurant" });
  }
};

export default {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
};
