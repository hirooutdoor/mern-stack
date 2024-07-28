import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
  console.log("MongoDB is successfully connected.");
}
).catch((err) => {
  console.log(err);
});

const app = express();

app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
