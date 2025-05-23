import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://chavanviraj475:viraj0407@cluster0.7cuo6.mongodb.net/wholesale-grocery-store').then(()=>console.log("DB connected"))
}



// import dotenv from "dotenv";

// Load environment variables from .env file
// dotenv.config();


// export const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };
