import mongoose from "mongoose";

const grocerySchema= new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    wholesale_Price:{type:Number,required:true},
    retail_Price:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true}
})

const grocerymodel= mongoose.models.grocery || mongoose.model("grocery",grocerySchema)

export default grocerymodel