import { Usermodel } from "../Models/UserModel.js";

const upcomingBirthdays = async (req, res) => {
  try {
    const currentDate = new Date();
    const users = await Usermodel.find(
      {
        date_of_birth: { $gte: currentDate },
      },
      {
        full_name: 1,
        date_of_birth: 1,
        profile_picture: 1,
        department: 1,
        designation:1
      }
    );
    if (users.length === 0) {
      res.status(404).json({ message: "No upcoming birthdays found." });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
};

export { upcomingBirthdays };
