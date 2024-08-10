import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "API is working" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "Unauthorized."));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters."));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.name) {
    if (req.body.name.length < 7 || req.body.name.length > 20) {
      return next(
        errorHandler(400, "Name must be between 7 and 20 characters.")
      );
    }
    if (req.body.name.includes(" ")) {
      return next(errorHandler(400, "Name must not contain spaces."));
    }
    if (req.body.name !== req.body.name.toLowerCase()) {
      return next(errorHandler(400, "Name must be lowercase."));
    }
    if (!req.body.name.match(/^[a-z0-9]+$/)) {
      return next(
        errorHandler(400, "Name must contain only letters and numbers.")
      );
    }
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};
