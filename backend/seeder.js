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
      firstName: "Ibrahim",
      lastName: "Aldhufeeri",
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

// Function to create Random Users
const createRandomUsers = async () => {
  try {
    // Find the last sequence number in the database
    const lastUser = await User.findOne(
      {},
      {},
      { sort: { sequenceNumber: -1 } }
    );
    let lastSequenceNumber = 1;

    if (lastUser) {
      lastSequenceNumber = lastUser.sequenceNumber;
    }

    // Ensure faker is correctly imported
    const faker = require("faker"); // Make sure to import faker

    for (let i = 0; i < 3; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const roles = ["Family", "Athlete", "Coach"];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const email = faker.internet.email(firstName, lastName);
      const phone = faker.phone.phoneNumber("050########");
      const password = "123123";
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        role,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });

      await newUser.save();
      console.log(`User ${i + 1}: ${firstName} ${lastName} created`);
    }

    console.log("All users created successfully!");
  } catch (error) {
    console.error("Error creating random users:", error);
  }
};

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
  },
  {
    firstName: "Wahab",
    lastName: "Alenezi",
    email: "wahab@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
  },
  {
    firstName: "Khaled",
    lastName: "Alharbi",
    email: "khaled@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
  },
  {
    firstName: "Yousif",
    lastName: "Aldhufeeri",
    email: "yousif@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
  },
  {
    firstName: "Hilayl",
    lastName: "Aldhufeeri",
    email: "hilayl@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
  },
  {
    firstName: "Omar",
    lastName: "Kanbar",
    email: "omar@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
  },
  {
    firstName: "Sultan",
    lastName: "Almutairi",
    email: "sultan@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
  },
  {
    firstName: "Abdulaziz",
    lastName: "Alkhaldi",
    email: "abdulaziz@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
  },
  {
    firstName: "Aziz",
    lastName: "Alshamrani",
    email: "aziz@gmail.com",
    phone: "0501234567",
    password: "123123",
    confirmPassword: "123123",
    role: "Family",
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
      } = familyUsers[i];
      const hashedPassword = await bcrypt.hash(password, 12);

      const newFamilyUser = new User({
        firstName,
        lastName,
        email,
        phone,
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
// createRandomUsers();
// createAdmin();
createFamilyUsers();
// deleteAllUsers();
