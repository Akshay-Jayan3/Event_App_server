import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Usermodel } from "../Models/UserModel.js";

const Register = async (req, res) => {
  try {
    const {
      username,
      password,
      full_name,
      date_of_birth,
      designation,
      location,
      employeeId,
      department,
    } = req.body;
    const filePath = req.file.path;
    const user = await Usermodel.findOne({ username });
    if (user) {
      return res.json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Usermodel({
      username,
      password: hashedPassword,
      full_name,
      date_of_birth,
      designation,
      profile_picture:filePath,
      location,
      employeeId,
      department,
    });
    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "An error occurred during registration." });
  }
};
const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(401)
        .json({ message: "Username and password are required" });
    }
    const user = await Usermodel.findOne({ username });
    if (!user) {
      return res.json({ message: "User doesn't exist" });
    }
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.json({ message: "username or password is incorrect" });
    }
    const token = jwt.sign({ id: user._id }, "secret");
    res.status(200).json({message:"Login successfull",
      token,
      userId: user._id,
      userDetails: {
        employeeId: user.employeeId,
        full_name: user.full_name,
        date_of_birth: user.date_of_birth,
        location: user.location,
        designation: user.designation,
        profile_picture: user.profile_picture,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      full_name,
      designation,
      department,
      date_of_birth,
      location,
      profile_picture,
    } = req.body;
    await Usermodel.findByIdAndUpdate(userId, {
      full_name,
      designation,
      department,
      date_of_birth,
      location,
      profile_picture,
    });

    res.status(200).json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading profile picture" });
  }
};

const getAllusers = async (req, res) => {
  const searchTerm = req.query.search;
  const query = {};
  if (searchTerm) {
    query.full_name = { $regex: searchTerm, $options: "i" };
  }
  try {
    const users = await Usermodel.find(query, { password: 0 });

    if (users.length === 0) {
      res.status(200).json({ message: "No people found" ,users});
    } else {
      res.status(200).json({users});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching people" });
  }
};
const getAUser = async (req, res) => {
  const userId  =req.params.userId
  try {
    const user = await Usermodel.findById(userId,{password:0});

    if (user.length === 0) {
      res.status(200).json({ message: "No people found" ,user});
    } else {
      res.status(200).json({user});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching people" });
  }
};
export { Register, Login, editProfile, getAllusers,getAUser };
