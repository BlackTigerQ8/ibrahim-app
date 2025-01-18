const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User } = require("./models/userModel");
const connectDB = require("./config/db.js");

connectDB();

// Function to create Admin
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const admin = await User.findOne({ role: "Admin" });
    if (admin) {
      console.log("Admin account already exists");
      return;
    }

    // Create new admin user
    const newAdmin = new User({
      firstName: "Abdullah",
      lastName: "Alenezi",
      phone: "66850080",
      dateOfBirth: "1995-07-21",
      email: "admin@gmail.com",
      password: "123123",
      confirmPassword: "123123",
      role: "Admin",
    });

    await newAdmin.save();
    console.log("Admin account created successfully");
  } catch (error) {
    console.error("Error creating admin account", error);
  }
};

function generateRandomDOB(startYear = 1980, endYear = 2000) {
  const year =
    Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1; // Days between 1 and 28 (to avoid invalid dates)
  return new Date(year, month, day).toISOString().split("T")[0]; // returns in YYYY-MM-DD format
}

// Family users list
const familyUsers = [
  {
    firstName: "Abdullah",
    lastName: "Alenezi",
    email: "abdullah@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Wahab",
    lastName: "Alenezi",
    email: "wahab@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Khaled",
    lastName: "Alharbi",
    email: "khaled@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Yousif",
    lastName: "Aldhufeeri",
    email: "yousif@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Hilayl",
    lastName: "Aldhufeeri",
    email: "hilayl@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Omar",
    lastName: "Kanbar",
    email: "omar@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Sultan",
    lastName: "Almutairi",
    email: "sultan@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Abdulaziz",
    lastName: "Alkhaldi",
    email: "abdulaziz@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
  {
    firstName: "Aziz",
    lastName: "Alshamrani",
    email: "aziz@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
    dateOfBirth: generateRandomDOB(),
  },
];

// Function to create Family users
const createFamilyUsers = async () => {
  try {
    // Check if family users already exist
    const existingFamilyUsers = await User.find({ role: "Family" });
    if (existingFamilyUsers.length > 0) {
      console.log("Family users already exist");
      return;
    }

    for (let i = 0; i < familyUsers.length; i++) {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        role,
        dateOfBirth, // Make sure you are including dateOfBirth here
      } = familyUsers[i];

      const hashedPassword = await bcrypt.hash(password, 12);

      const newFamilyUser = new User({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth, // Use dateOfBirth here
        password: hashedPassword,
        confirmPassword: hashedPassword,
        role,
      });

      await newFamilyUser.save();
      console.log(`Family user created: ${firstName} ${lastName}`);
    }

    console.log("All family users created successfully!");
  } catch (error) {
    console.error("Error creating family users:", error);
  } finally {
    mongoose.connection.close(); // Ensure connection is closed only after all users are created
  }
};

// Function to delete all users
const deleteAllUsers = async () => {
  try {
    await User.deleteMany({});
    console.log("All users deleted");
  } catch (error) {
    console.error("Error deleting users:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Uncomment the relevant function call as needed
createAdmin();
// createFamilyUsers();
// deleteAllUsers();
