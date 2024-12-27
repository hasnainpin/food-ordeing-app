import { Request, Response } from "express";
import User from "../Models/user";
export interface CustomRequest extends Request {
  userId?: string;
}

export const getCurrentUser = async (req: CustomRequest, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    res.json(currentUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "error fetching user" });
  }
};

const createCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).send();
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating  user " });
  }
};
export const updateCurrentUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, addressLine1, country, city } = req.body;

    if (!req.userId) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
