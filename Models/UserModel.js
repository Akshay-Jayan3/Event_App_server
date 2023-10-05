import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  full_name: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  designation: {
    type: String,
  },
  profile_picture:{
    type:String
  },
  location:{
    type:String
  },
  employeeId:{
    type:String
  },
  department:{
    type:String
  },
  email:{
    type:String
  }
});


export const Usermodel = mongoose.model("users",userSchema)