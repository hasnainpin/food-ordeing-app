import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("addressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("city must be a string"),
  body("country").isString().notEmpty().withMessage("country must be a string"),
  handleValidationErrors,
];
export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("restaurant name is required"),
  body("city").notEmpty().withMessage("city is required"),
  body("country").notEmpty().withMessage("country is  required"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("delivery price must be a positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("estimated delivery time must be a positive integer "),
  body("cuisine")
    .isArray()
    .withMessage("cuisine must be a array")
    .not()
    .isEmpty()
    .withMessage("cuisine array cant not be empty"),
  body("menuItem").isArray().withMessage("menu item must be a array"),
  body("menuItem.*.name").notEmpty().withMessage("menu item is required"),
  body("menuItem.*.price")
    .isFloat({ min: 0 })
    .withMessage("menu item is required and must be a positive number"),
  handleValidationErrors,
];
