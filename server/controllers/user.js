import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const jwt_secret = process.env.JWT_SECRET;

const signupController = async (req, res) => {
  const { fullName, email, password, profileImg } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: "Please fill all required fields" });
  }

  const user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(401)
      .send({ error: "This email is already exist in the database" });
  }

  const hashPassword = await bcryptjs.hash(password, 16);
  const newUserInfo = {
    fullName,
    email,
    password: hashPassword,
    profileImg,
  };
  const newUser = new User(newUserInfo);
  await newUser.save();
  return res.status(200).json({ msg: "Signup Successfully" });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill all required fields" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(500).json({ error: "Invalid Credentials" });
  }

  const hashPassword = await bcryptjs.compare(password, user.password);
  if (hashPassword) {
    const jwtToken = jwt.sign({ _id: user._id }, jwt_secret);
    let userInfo = {
      email: user.email,
      id: user._id,
      fullName: user.fullName,
      token: jwtToken,
    };

    return res.status(200).json({ result: { user: userInfo } });
  } else {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
};

export { signupController, loginController };
