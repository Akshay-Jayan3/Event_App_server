import mongoose from "mongoose";

const categorySchema =new mongoose.Schema({
    label:{
        type:String,
    },
    mainColor: {
        type: String,
      },
    subColor: {
    type: String,
    },
})
export const Categorymodel = mongoose.model("categories",categorySchema)
