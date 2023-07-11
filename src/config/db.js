import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.API_DB);
    console.log("connecting successful");
  } catch (error) {
    console.log(error);
  }
};
