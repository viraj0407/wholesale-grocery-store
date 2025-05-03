import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://chavanviraj475:viraj0407@cluster0.7cuo6.mongodb.net/wholesale-grocery-store').then(()=>console.log("DB connected"))
}