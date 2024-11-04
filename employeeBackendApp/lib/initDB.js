const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./employee_backend_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT,
      position TEXT,
      department TEXT,
      salary INTEGER,
      years_of_experience INTEGER
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Employees table created or already exists.");
      }
    }
  );

  const stmt = db.prepare(
    "INSERT INTO employees (name, position, department, salary, years_of_experience) VALUES (?, ?, ?, ?, ?)"
  );

  let employees = [
    {
      id: 1,
      name: "Alice Smith",
      position: "Software Engineer",
      department: "Engineering",
      salary: 90000,
      years_of_experience: 5,
    },
    {
      id: 2,
      name: "Bob Johnson",
      position: "Project Manager",
      department: "Management",
      salary: 120000,
      years_of_experience: 10,
    },
    {
      id: 3,
      name: "Charlie Brown",
      position: "Designer",
      department: "Design",
      salary: 70000,
      years_of_experience: 4,
    },
    {
      id: 4,
      name: "David Wilson",
      position: "QA Engineer",
      department: "Engineering",
      salary: 80000,
      years_of_experience: 6,
    },
    {
      id: 5,
      name: "Eve Davis",
      position: "HR Specialist",
      department: "HR",
      salary: 60000,
      years_of_experience: 3,
    },
  ];

  for (let employee of employees) {
    stmt.run(
      employee.name,
      employee.position,
      employee.department,
      employee.salary,
      employee.years_of_experience
    );
  }
  stmt.finalize();

  console.log("Inserted 5 employees into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
