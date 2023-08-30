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
      profile_picture,
      location,
      employeeId,
      department,
    } = req.body;
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
      profile_picture,
      location,
      employeeId,
      department,
    });
    await newUser.save();
    res.json({ message: "User created successfully" });
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
        .status(400)
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
    res.json({
      token,
      userid: user._id,
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

    res.json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading profile picture" });
  }
};

const getAllusers = async (req, res) => {
  try {
    const users = await Usermodel.find({}, { full_name: 1 });

    if (users.length === 0) {
      res.status(404).json({ message: "No people found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching people" });
  }
};

export { Register, Login, editProfile, getAllusers };
