import express from "express";
import MyUserController from "../controller/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();
router.get("/my/user", jwtCheck, jwtParse, MyUserController.getCurrentUser);
router.post("/my/user", jwtCheck, MyUserController.createCurrentUser);
router.put(
  "/my/user",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);

export default router;
