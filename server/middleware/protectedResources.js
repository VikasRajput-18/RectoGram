import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { config } from "dotenv";

config();

const protectedResources = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({ msg: "User not logged in" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      res.status(401).send({ msg: "User not logged in" });
    }
    const { _id } = payload;
    User.findById(_id).then((dbUser) => {
      req.user = dbUser;
      next();
    });
  });
};

export default protectedResources;
