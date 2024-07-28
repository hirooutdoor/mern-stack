import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 45,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;