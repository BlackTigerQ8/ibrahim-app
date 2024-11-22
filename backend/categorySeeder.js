const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/CategoryModel");

dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Sample categories to seed
const categories = [
  {
    name: "Technology",
    description: "Categories related to technology and gadgets",
    role: ["Athlete", "Family"],
    image: "https://example.com/tech.jpg",
  },
  {
    name: "Health & Fitness",
    description: "Categories focused on health, wellness, and fitness",
    role: ["Athlete", "Family"],
    image: "https://example.com/health.jpg",
  },
  {
    name: "Education",
    description: "Categories about educational resources and learning",
    role: ["Athlete", "Family"],
    image: "https://example.com/education.jpg",
  },
  {
    name: "Food & Beverages",
    description: "Categories about food, drinks, and dining",
    role: ["Athlete", "Family"],
    image: "https://example.com/food.jpg",
  },
  {
    name: "Travel & Tourism",
    description: "Categories about travel destinations and experiences",
    role: ["Athlete", "Family"],
    image: "https://example.com/travel.jpg",
  },
];

// Seed categories into the database
const seedCategories = async () => {
  try {
    await connectDB();
    await Category.deleteMany(); // Clear existing categories
    const createdCategories = await Category.insertMany(categories);

    console.log("Categories seeded successfully:", createdCategories);
    process.exit(0); // Exit script after success
  } catch (error) {
    console.error("Error seeding categories:", error.message);
    process.exit(1); // Exit script after failure
  }
};

// Delete all categories from the database
const deleteAllCategories = async () => {
  try {
    await connectDB();
    const result = await Category.deleteMany(); // Clear existing categories
    console.log("All categories deleted:", result.deletedCount);
    process.exit(0); // Exit script after success
  } catch (error) {
    console.error("Error deleting categories:", error.message);
    process.exit(1); // Exit script after failure
  }
};

seedCategories();
// deleteAllCategories();
