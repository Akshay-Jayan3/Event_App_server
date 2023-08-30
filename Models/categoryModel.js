import mongoose from "mongoose";

const categorySchema =new mongoose.Schema({
    category:{
        type:String,
    }
})
export const Categorymodel = mongoose.model("category",categorySchema)
