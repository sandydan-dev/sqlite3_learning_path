const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "courses_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) {
    console.log("Connection established");
  } else {
    console.log("Failed to connect to the database");
    process.exit(1);
  }
})();

// get all course from database
async function getAllCourses() {
  let query = "SELECT * FROM courses";
  let responseQuery = await db.all(query, []);
  return { courses: responseQuery };
}
app.get("/courses", async (req, res) => {
  try {
    let result = await getAllCourses();
    if (result.length === 0) {
      res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch courses by instructor and get id, title, instructor, category
async function getCourseByInstructor(instructor) {
  let query =
    "SELECT id, title, instructor, category FROM courses WHERE instructor =?";
  let responseQuery = await db.all(query, [instructor]);
  return { courses: responseQuery };
}
app.get("/courses/instructor/:instructor", async (req, res) => {
  try {
    let instructor = req.params.instructor;
    let result = await getCourseByInstructor(instructor);

    if (result.courses.length === 0) {
      return res
        .status(404)
        .json({ message: "Course by this instructor not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// extract id, title release_year and category,fetch courses by category
async function fetchCourseBySpecificCategory(category) {
  let query = `SELECT id, title, release_year, category FROM courses WHERE category =?`;
  let responseQuery = await db.all(query, [category]);
  return { courses: responseQuery }; // return the courses with specific category
}
app.get("/courses/category/:category", async (req, res) => {
  try {
    let category = req.params.category;
    let result = await fetchCourseBySpecificCategory(category);

    if (result.courses.length === 0) {
      return res
        .status(404)
        .json({ message: "Course by this category not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// extract id, title , release_year and get data by year
async function fetchCourseBySpecificYear(year) {
  let query =
    "SELECT id, title, release_year FROM courses WHERE release_year = ?";
  let responseQuery = await db.all(query, [year]);
  return { courses: responseQuery };
}
app.get("/courses/year/:year", async (req, res) => {
  try {
    let year = parseInt(req.params.year);
    let result = await fetchCourseBySpecificYear(year);

    if (result.courses.length == 0) {
      return res.status(404).json({ message: "Course not found by this year" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listen incoming requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
