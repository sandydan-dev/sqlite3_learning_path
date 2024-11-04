const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "course_backend_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) {
    console.log("Connection established");
  } else {
    console.log("Failed to connect to database");
  }
})();

// fetch course by minimum rating with specified value
async function filterCourseByMinRating(minRating) {
  let query = "SELECT * FROM courses WHERE rating <= ?";
  let responseQuery = await db.all(query, [minRating]);
  return { courses: responseQuery };
}
app.get("/courses/rating", async (req, res) => {
  try {
    let minRating = parseInt(req.query.minRating);
    let result = await filterCourseByMinRating(minRating);
    if (result.courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found by this minimum rating" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch courses by instructor and min duration and duration greather that specific value
async function filterCoursesByInstructorAndDuration(instructor, minDuration) {
  let query = "SELECT * FROM courses WHERE instructor = ? AND duration < ?";
  let responseQuery = await db.all(query, [instructor, minDuration]);
  return { courses: responseQuery };
}
app.get("/courses/instructor-duration", async (req, res) => {
  try {
    let instructor = req.query.instructor;
    let minDuration = parseInt(req.query.minDuration);

    let result = await filterCoursesByInstructorAndDuration(
      instructor,
      minDuration
    );
    if (result.courses.length === 0) {
      return res.status(404).json({
        message: "No courses found by this instructor and minimum duration",
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch couses by price and order by descending order
async function filterCourseByPriceOrder() {
  let query = "SELECT * FROM courses WHERE price ORDER BY price DESC";
  let responseQuery = await db.all(query, []);
  return { courses: responseQuery };
}
app.get("/courses/ordered-by-price", async (req, res) => {
  try {
    let result = await filterCourseByPriceOrder();
    if (result.courses.length === 0) {
      return res.status(404).json({ message: "No courses price found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listening incomming request
app.listen(port, () => {
  console.log("Server listening on port 3000");
});
