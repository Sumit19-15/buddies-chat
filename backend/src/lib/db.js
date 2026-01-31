import mongoose from "mongoose";

export default connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database", conn.connection.host);
  } catch (error) {
    console.error("Failed to connect database", error);
    process.exit(1);
  }
};
