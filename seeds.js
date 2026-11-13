const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");
const Company = require("./models/Company");
const Student = require("./models/Student");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/TnP";

async function seedDatabase() {
  await mongoose.connect(dbUrl);
  console.log("Connected to MongoDB for seeding...");

  // Clear existing collections
  await User.deleteMany({});
  await Company.deleteMany({});
  await Student.deleteMany({});
  console.log("Cleared existing users, companies, and students.");

  // Create default admin user
  const admin = new User({
    username: "admin",
    email: "admin@tnp.edu",
  });
  admin.setPassword("admin123");
  await admin.save();
  console.log("Created default admin user: admin / admin123");

  // Create Sample Companies / Campus Drives
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const google = await Company.create({
    name: "Google",
    role: "Software Development Engineer (SDE)",
    package: "28 LPA",
    description:
      "Join the Core Systems & Infrastructure team. Work on distributed systems, large scale cloud backends, and algorithmic optimization.",
    deadline: nextMonth,
    criteria: {
      minTenthPercentage: 75,
      minTwelfthPercentage: 75,
      minUgCgpa: 8.0,
      minPgCgpa: 8.0,
      maxBacklogs: 0,
    },
  });

  const microsoft = await Company.create({
    name: "Microsoft",
    role: "Cloud Solution Architect",
    package: "24 LPA",
    description:
      "Build cutting-edge Azure enterprise applications, DevOps pipelines, and AI-driven cloud automation services.",
    deadline: nextWeek,
    criteria: {
      minTenthPercentage: 70,
      minTwelfthPercentage: 70,
      minUgCgpa: 7.5,
      minPgCgpa: 7.5,
      maxBacklogs: 0,
    },
  });

  const tcs = await Company.create({
    name: "TCS Digital",
    role: "System Engineer",
    package: "7.5 LPA",
    description:
      "Full stack development, modern UI/UX design, and cloud database administration for enterprise clients worldwide.",
    deadline: nextMonth,
    criteria: {
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      minUgCgpa: 6.5,
      minPgCgpa: 6.5,
      maxBacklogs: 1,
    },
  });

  console.log("Created 3 sample campus drives (Google, Microsoft, TCS Digital).");

  // Create Sample Students
  const students = [
    {
      name: "Aarav Sharma",
      rollNo: "CS2026-001",
      branch: "Computer Engineering",
      tenthPercentage: 92.5,
      twelfthPercentage: 89.0,
      ugCgpa: 9.2,
      pgCgpa: 9.4,
      resumeLink: "https://drive.google.com/file/d/example-aarav",
      activeBacklogs: 0,
      appliedDrives: [google._id, microsoft._id],
    },
    {
      name: "Priya Patel",
      rollNo: "IT2026-015",
      branch: "Information Technology",
      tenthPercentage: 84.0,
      twelfthPercentage: 82.5,
      ugCgpa: 8.3,
      pgCgpa: 8.6,
      resumeLink: "https://drive.google.com/file/d/example-priya",
      activeBacklogs: 0,
      appliedDrives: [google._id, microsoft._id, tcs._id],
    },
    {
      name: "Rohan Deshmukh",
      rollNo: "MCA2026-042",
      branch: "MCA",
      tenthPercentage: 78.0,
      twelfthPercentage: 74.0,
      ugCgpa: 7.8,
      pgCgpa: 8.0,
      resumeLink: "https://drive.google.com/file/d/example-rohan",
      activeBacklogs: 0,
      appliedDrives: [microsoft._id, tcs._id],
    },
    {
      name: "Sneha Kulkarni",
      rollNo: "ETC2026-023",
      branch: "Electronics & Telecommunication",
      tenthPercentage: 68.0,
      twelfthPercentage: 66.5,
      ugCgpa: 6.9,
      pgCgpa: 7.1,
      resumeLink: "https://drive.google.com/file/d/example-sneha",
      activeBacklogs: 1,
      appliedDrives: [tcs._id],
    },
    {
      name: "Vikram Rathod",
      rollNo: "ME2026-011",
      branch: "Mechanical",
      tenthPercentage: 62.0,
      twelfthPercentage: 61.0,
      ugCgpa: 6.2,
      pgCgpa: 6.4,
      resumeLink: "https://drive.google.com/file/d/example-vikram",
      activeBacklogs: 2,
      appliedDrives: [tcs._id],
    },
  ];

  await Student.insertMany(students);
  console.log(`Created ${students.length} sample students with varied profiles.`);

  await mongoose.connection.close();
  console.log("Seeding complete and database connection closed.");
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
