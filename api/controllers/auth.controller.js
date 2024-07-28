import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || name === "" || email === "" || password === "") {
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
    };
};
