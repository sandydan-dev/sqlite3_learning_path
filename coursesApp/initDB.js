const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./courses_database.sqlite", (err) => {
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
      title TEXT,
      instructor TEXT,
      category TEXT,
      release_year INTEGER
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
    "INSERT INTO courses (title, instructor, category, release_year) VALUES (?, ?, ?, ?)",
  );

  let courses = [
    {
      id: 1,
      title: "Introduction to Python",
      instructor: "Alice Smith",
      category: "Programming",
      release_year: 2018,
    },
    {
      id: 2,
      title: "Advanced Machine Learning",
      instructor: "Bob Johnson",
      category: "Data Science",
      release_year: 2020,
    },
    {
      id: 3,
      title: "Introduction to Databases",
      instructor: "John Doe",
      category: "Database",
      release_year: 2017,
    },
    {
      id: 4,
      title: "Data Structures",
      instructor: "John Doe",
      category: "Computer Science",
      release_year: 2016,
    },
    {
      id: 5,
      title: "Data Analysis with Python",
      instructor: "Alice Smith",
      category: "Data Science",
      release_year: 2019,
    },
    {
      id: 6,
      title: "Introduction to AI",
      instructor: "Carol White",
      category: "Artificial Intelligence",
      release_year: 2021,
    },
    {
      id: 7,
      title: "Deep Learning Fundamentals",
      instructor: "Carol White",
      category: "Artificial Intelligence",
      release_year: 2021,
    },
    {
      id: 8,
      title: "Web Development with JavaScript",
      instructor: "Dave Lee",
      category: "Web Development",
      release_year: 2020,
    },
    {
      id: 9,
      title: "Cybersecurity Basics",
      instructor: "Eve Black",
      category: "Cybersecurity",
      release_year: 2022,
    },
    {
      id: 10,
      title: "Cloud Computing Essentials",
      instructor: "Frank Green",
      category: "Cloud Computing",
      release_year: 2019,
    },
  ];

  for (let course of courses) {
    stmt.run(
      course.title,
      course.instructor,
      course.category,
      course.release_year,
    );
  }
  stmt.finalize();

  console.log("Inserted 10 courses into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});