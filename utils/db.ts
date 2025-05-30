import mongoose from "mongoose"

const MONGO_URL = process.env.MONGO_URL!

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  return mongoose.connect(MONGO_URL)
}
