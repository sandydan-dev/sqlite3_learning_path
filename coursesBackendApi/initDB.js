const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./course_backend_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT,
      description TEXT,
      duration INTEGER,
      instructor TEXT,
      rating REAL,
      price INTEGER
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Courses table created or already exists.");
      }
    },
  );

  const stmt = db.prepare(
    "INSERT INTO courses (name, description, duration, instructor, rating, price) VALUES (?, ?, ?, ?, ?, ?)",
  );

  let courses = [
    {
      id: 1,
      name: "Course 1",
      description: "Description for Course 1",
      duration: 10,
      instructor: "Instructor A",
      rating: 4.5,
      price: 100,
    },
    {
      id: 2,
      name: "Course 2",
      description: "Description for Course 2",
      duration: 12,
      instructor: "Instructor B",
      rating: 4.0,
      price: 150,
    },
    {
      id: 3,
      name: "Course 3",
      description: "Description for Course 3",
      duration: 8,
      instructor: "Instructor C",
      rating: 3.5,
      price: 200,
    },
    {
      id: 4,
      name: "Course 4",
      description: "Description for Course 4",
      duration: 15,
      instructor: "Instructor D",
      rating: 4.8,
      price: 180,
    },
    {
      id: 5,
      name: "Course 5",
      description: "Description for Course 5",
      duration: 7,
      instructor: "Instructor A",
      rating: 4.2,
      price: 90,
    },
    {
      id: 6,
      name: "Course 6",
      description: "Description for Course 6",
      duration: 9,
      instructor: "Instructor B",
      rating: 3.8,
      price: 130,
    },
    {
      id: 7,
      name: "Course 7",
      description: "Description for Course 7",
      duration: 11,
      instructor: "Instructor C",
      rating: 4.6,
      price: 160,
    },
    {
      id: 8,
      name: "Course 8",
      description: "Description for Course 8",
      duration: 14,
      instructor: "Instructor D",
      rating: 4.1,
      price: 140,
    },
    {
      id: 9,
      name: "Course 9",
      description: "Description for Course 9",
      duration: 6,
      instructor: "Instructor A",
      rating: 3.9,
      price: 120,
    },
    {
      id: 10,
      name: "Course 10",
      description: "Description for Course 10",
      duration: 10,
      instructor: "Instructor B",
      rating: 4.3,
      price: 110,
    },
    {
      id: 11,
      name: "Course 11",
      description: "Description for Course 11",
      duration: 13,
      instructor: "Instructor C",
      rating: 4.7,
      price: 170,
    },
    {
      id: 12,
      name: "Course 12",
      description: "Description for Course 12",
      duration: 5,
      instructor: "Instructor D",
      rating: 3.6,
      price: 80,
    },
    {
      id: 13,
      name: "Course 13",
      description: "Description for Course 13",
      duration: 7,
      instructor: "Instructor A",
      rating: 4.4,
      price: 90,
    },
    {
      id: 14,
      name: "Course 14",
      description: "Description for Course 14",
      duration: 8,
      instructor: "Instructor B",
      rating: 3.7,
      price: 100,
    },
    {
      id: 15,
      name: "Course 15",
      description: "Description for Course 15",
      duration: 9,
      instructor: "Instructor C",
      rating: 4.9,
      price: 210,
    },
  ];

  for (let course of courses) {
    stmt.run(
      course.name,
      course.description,
      course.duration,
      course.instructor,
      course.rating,
      course.price,
    );
  }
  stmt.finalize();

  console.log("Inserted 15 courses into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});