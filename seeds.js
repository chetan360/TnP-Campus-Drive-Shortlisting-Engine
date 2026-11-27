const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");
const Company = require("./models/Company");
const Student = require("./models/Student");
const InterviewExperience = require("./models/InterviewExperience");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/TnP";

async function seedDatabase() {
  await mongoose.connect(dbUrl);
  console.log("Connected to MongoDB for seeding...");

  // Clear existing collections
  await User.deleteMany({});
  await Company.deleteMany({});
  await Student.deleteMany({});
  await InterviewExperience.deleteMany({});
  console.log(
    "Cleared existing users, companies, students, and interview experiences.",
  );

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

  const interviewExperiences = [
    {
      name: "Ananya Joshi",
      email: "ananya.joshi@example.com",
      content: `# Google SDE Interview Experience

I interviewed for the **Software Development Engineer** role through our campus placement drive. The complete process took two days.

## Online assessment

- Two data-structure problems in 90 minutes
- One problem used sliding window
- The second problem required graphs and BFS

## Technical interviews

The first round focused on arrays, hash maps, and explaining the time complexity of my solution. In the second round, I designed a small URL shortener and discussed database choices.

> The interviewers cared as much about clear communication as the final answer.

## My preparation advice

Practice writing complete solutions without an IDE, revise core CS subjects, and always explain your assumptions before coding.`,
    },
    {
      name: "Rahul Patil",
      email: "rahul.patil@example.com",
      content: `# TCS Digital Interview Experience

The selection process included an aptitude test, a coding round, and one combined technical and HR interview.

## Questions I received

1. Explain the four pillars of OOP.
2. Write a SQL query using a join.
3. Describe my final-year project and my contribution.
4. Explain REST APIs and common HTTP methods.

## Final takeaway

Be confident about everything written on your resume. The panel asked several follow-up questions about my project, but the overall conversation was friendly.`,
    },
    {
      name: "Meera Shah",
      email: "meera.shah@example.com",
      content: `# Microsoft Cloud Role Interview Experience

I applied for a cloud-focused graduate role. There were three rounds after the initial resume shortlist.

## Round overview

- **Round 1:** Coding and problem solving
- **Round 2:** Operating systems, networking, and cloud fundamentals
- **Round 3:** Managerial discussion and behavioural questions

## A useful question

The interviewer asked how I would investigate a web application that suddenly became slow. I structured the answer around metrics, logs, database queries, and network latency.

## Advice for future candidates

Use the STAR method for behavioural answers and prepare two strong project stories with measurable outcomes.`,
    },
  ];

  await InterviewExperience.insertMany(interviewExperiences);
  console.log("Created 3 sample interview experiences.");

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
