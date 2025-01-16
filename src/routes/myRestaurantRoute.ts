import express from "express";
import MyRestaurantController from "../controller/MyRestaurantController";
import multer from "multer";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const route = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
// const { uploadImage } = require("../middleware/UploadImage");

route.get(
  "/my/restaurant",
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurant
);
route.post(
  "/my/restaurant",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.createMyRestaurant
);
route.put(
  "/my/restaurant",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateMyRestaurant
);

export default route;
