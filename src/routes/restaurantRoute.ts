import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controller/RestaurantController";

const route = express.Router();

route.get(
  "/restaurant/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city parameter must be a string"),
  RestaurantController.searchMyRestaurant
);

export default route;
