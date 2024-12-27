import exp from "constants";
import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../Models/user";

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISS_USER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export interface CustomRequest extends Request {
  auth0Id?: string;
  userId?: any;
}

export const jwtParse = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (!decoded || !decoded.sub) {
      res.status(401).send({ message: "Invalid token" });
      return;
    }

    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.status(401).send({ message: "User not found" });
      return;
    }

    req.auth0Id = auth0Id;
    req.userId = user._id.toString();

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT Parse Error:", error);
    next(error); // Pass error to the Express error handler
  }
};
