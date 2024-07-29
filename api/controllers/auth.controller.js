import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required."));
  }

  if (name.length > 45) {
    next(errorHandler(400, "Name is too long."));
  }

  if (email.length > 255) {
    next(errorHandler(400, "Email is too long."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("User signed up successfully.");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
   return next(errorHandler(400, "All fields are required."));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
     return next(errorHandler(404, "User not found."));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
    return  next(errorHandler(400, "Invalid password."));
    }
      
      const { password:_, ...rest } = validUser._doc;
    
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest);
  } catch (err) {
    next(err);
  }

  res.json("User signed in successfully.");
};
