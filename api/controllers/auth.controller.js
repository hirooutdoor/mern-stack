import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || name === "" || email === "" || password === "") {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (name.length > 255) {
        return res.status(400).json({ message: "Email fields must be less than 255 characters." });
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
        return res.status(500).json({ message: err.message });
    }
};
