const { spawn } = require("child_process");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

async function runTests() {
  console.log("Starting MongoDB daemon for testing...");
  const mongod = spawn("C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe", [
    "--dbpath",
    "./data/db",
    "--bind_ip",
    "127.0.0.1",
  ]);

  await new Promise((resolve) => {
    mongod.stdout.on("data", (d) => {
      if (d.toString().includes("Waiting for connections")) {
        resolve();
      }
    });
  });

  console.log("MongoDB started. Booting Express app...");
  const app = require("./app");
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(3001, () => {
      console.log("Test server running on port 3001.");
      resolve();
    });
  });

  let sessionCookie = "";

  function request(options, postData) {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: 3001,
          ...options,
          headers: {
            ...options.headers,
            ...(sessionCookie ? { Cookie: sessionCookie } : {}),
            ...(postData
              ? {
                  "Content-Type":
                    options.headers?.["Content-Type"] ||
                    "application/x-www-form-urlencoded",
                  "Content-Length": Buffer.byteLength(postData),
                }
              : {}),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            const setCookie = res.headers["set-cookie"];
            if (setCookie) {
              sessionCookie = setCookie.map((c) => c.split(";")[0]).join("; ");
            }
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body,
            });
          });
        }
      );
      req.on("error", reject);
      if (postData) req.write(postData);
      req.end();
    });
  }

  try {
    console.log("\n--- TEST 1: GET / (Home Page) ---");
    let res = await request({ method: "GET", path: "/" });
    console.log(`Status: ${res.statusCode} | Includes 'TnP Campus Drive': ${res.body.includes("TnP Campus Drive")}`);
    if (res.statusCode !== 200) throw new Error("GET / failed");

    console.log("\n--- TEST 2: GET /drives (Show All Drives) ---");
    res = await request({ method: "GET", path: "/drives" });
    console.log(`Status: ${res.statusCode} | Includes 'Google': ${res.body.includes("Google")}`);
    if (res.statusCode !== 200 || !res.body.includes("Google")) throw new Error("GET /drives failed");

    console.log("\n--- TEST 3: GET /drives/results (Results View) ---");
    res = await request({ method: "GET", path: "/drives/results" });
    console.log(`Status: ${res.statusCode} | Includes 'Results & Updates': ${res.body.includes("Results & Updates")}`);
    if (res.statusCode !== 200) throw new Error("GET /drives/results failed");

    console.log("\n--- TEST 4: POST /auth/login (Admin Login) ---");
    const loginData = "username=admin&password=admin123";
    res = await request({ method: "POST", path: "/auth/login" }, loginData);
    console.log(`Status: ${res.statusCode} | Redirect: ${res.headers.location}`);
    if (res.statusCode !== 302 || !res.headers.location.includes("/admin/dashboard")) {
      throw new Error("Admin login failed");
    }

    console.log("\n--- TEST 5: GET /admin/dashboard (Admin Dashboard) ---");
    res = await request({ method: "GET", path: "/admin/dashboard" });
    console.log(`Status: ${res.statusCode} | Includes 'TnP Admin Dashboard': ${res.body.includes("TnP Admin Dashboard")}`);
    if (res.statusCode !== 200 || !res.body.includes("Campus Drives Management")) {
      throw new Error("Admin Dashboard view failed");
    }

    console.log("\n--- TEST 6: POST /drives (Create Drive via Admin Dashboard) ---");
    const newDriveData = new URLSearchParams({
      name: "Amazon",
      role: "Cloud Support Associate",
      package: "16 LPA",
      deadline: "2026-12-31",
      description: "AWS cloud operations and client support architecture.",
      minTenthPercentage: "65",
      minTwelfthPercentage: "65",
      minUgCgpa: "7.0",
      minPgCgpa: "7.0",
      maxBacklogs: "0",
    }).toString();
    res = await request({ method: "POST", path: "/drives" }, newDriveData);
    console.log(`Status: ${res.statusCode} | Redirect: ${res.headers.location}`);
    if (res.statusCode !== 302) throw new Error("Create Drive failed");

    const Company = require("./models/Company");
    const amazon = await Company.findOne({ name: "Amazon" });
    console.log(`Verified in DB: Created drive ID: ${amazon?._id}, Role: ${amazon?.role}`);
    if (!amazon) throw new Error("Amazon drive not found in DB");

    console.log("\n--- TEST 7: POST /drives/:id/edit -> PUT /drives/:id (Update Drive) ---");
    const updateDriveData = new URLSearchParams({
      name: "Amazon Web Services",
      role: "Cloud Support Associate",
      package: "18 LPA",
      deadline: "2026-12-31",
      description: "Updated AWS cloud operations and client support architecture.",
      minTenthPercentage: "68",
      minTwelfthPercentage: "68",
      minUgCgpa: "7.2",
      minPgCgpa: "7.2",
      maxBacklogs: "0",
    }).toString();
    res = await request(
      { method: "POST", path: `/drives/${amazon._id}?_method=PUT` },
      updateDriveData
    );
    console.log(`Status: ${res.statusCode} | Redirect: ${res.headers.location}`);
    const updatedAmazon = await Company.findById(amazon._id);
    console.log(`Verified in DB: Name updated to '${updatedAmazon.name}', Package to '${updatedAmazon.package}'`);
    if (updatedAmazon.name !== "Amazon Web Services" || updatedAmazon.package !== "18 LPA") {
      throw new Error("Update drive failed");
    }

    console.log("\n--- TEST 8: POST /drives/:id/apply (Student Application) ---");
    const applyData = new URLSearchParams({
      name: "Karan Johar",
      rollNo: "CS2026-099",
      branch: "Computer Engineering",
      tenthPercentage: "85.0",
      twelfthPercentage: "84.0",
      ugCgpa: "8.5",
      pgCgpa: "8.7",
      resumeLink: "https://drive.google.com/file/d/example-karan",
      activeBacklogs: "0",
    }).toString();
    res = await request({ method: "POST", path: `/drives/${amazon._id}/apply` }, applyData);
    console.log(`Status: ${res.statusCode} | Redirect: ${res.headers.location}`);
    const Student = require("./models/Student");
    const karan = await Student.findOne({ rollNo: "CS2026-099" });
    console.log(`Verified Student in DB: ${karan?.name}, applied drives count: ${karan?.appliedDrives?.length}`);
    if (!karan || !karan.appliedDrives.includes(amazon._id)) throw new Error("Apply drive failed");

    console.log("\n--- TEST 9: GET /drives/:id/shortlist (Drive Shortlisting Result) ---");
    res = await request({ method: "GET", path: `/drives/${amazon._id}/shortlist` });
    console.log(`Status: ${res.statusCode} | Includes 'Karan Johar': ${res.body.includes("Karan Johar")}`);
    if (res.statusCode !== 200 || !res.body.includes("Karan Johar")) {
      throw new Error("Drive Shortlisting Result failed");
    }

    console.log("\n--- TEST 10: GET & POST /shortlist (Interactive Shortlisting Engine) ---");
    res = await request({ method: "GET", path: "/shortlist" });
    console.log(`Status: ${res.statusCode} | Includes 'Set Shortlisting Cutoffs': ${res.body.includes("Set Shortlisting Cutoffs")}`);
    if (res.statusCode !== 200) throw new Error("GET /shortlist failed");

    const shortlistData = new URLSearchParams({
      minTenthPercentage: "70",
      minTwelfthPercentage: "70",
      minUgCgpa: "7.5",
      minPgCgpa: "7.5",
      maxBacklogs: "0",
    }).toString();
    res = await request({ method: "POST", path: "/shortlist" }, shortlistData);
    console.log(`Status: ${res.statusCode} | Includes 'Shortlisted Students': ${res.body.includes("Shortlisted Students")}`);
    if (res.statusCode !== 200 || !res.body.includes("Shortlisted Students")) {
      throw new Error("POST /shortlist web view failed");
    }

    console.log("\n--- TEST 11: DELETE /drives/:id (Delete Drive via Admin) ---");
    res = await request({ method: "POST", path: `/drives/${amazon._id}?_method=DELETE` });
    console.log(`Status: ${res.statusCode} | Redirect: ${res.headers.location}`);
    const deletedDrive = await Company.findById(amazon._id);
    console.log(`Verified in DB: Drive exists? ${deletedDrive !== null}`);
    if (deletedDrive !== null) throw new Error("Delete drive failed");

    console.log("\n=============================================");
    console.log(">>> ALL 11 TESTS PASSED SUCCESSFULLY! <<<");
    console.log("=============================================\n");
  } finally {
    server.close();
    await mongoose.connection.close();
    mongod.kill();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
