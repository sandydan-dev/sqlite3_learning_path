const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "employee_backend_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connection established");
  else console.log("Connection failed");
})();

// fetch emloyees by max salary and
async function filterEmployeeByMaxSalary(maxSalary) {
  let query = "SELECT * FROM employees WHERE salary > ?";
  let responseQuery = await db.all(query, [maxSalary]);
  return { employees: responseQuery };
}
app.get("/employees/salary", async (req, res) => {
  try {
    let maxSalary = parseInt(req.query.maxSalary);
    let result = await filterEmployeeByMaxSalary(maxSalary);

    if (result.employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found with the given salary" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch employees by department and min experience with specific department and min experience which is
// experience greater that specified value

async function filterEmployeesByDepartmentAndMaxExperience(
  department,
  maxExperience
) {
  let query =
    "SELECT * FROM employees WHERE department = ? AND years_of_experience > ?";
  let responseQuery = await db.all(query, [department, maxExperience]);
  return { employees: responseQuery };
}

app.get("/employees/department-experience", async (req, res) => {
  try {
    let department = req.query.department;
    let maxExperience = parseInt(req.query.maxExperience);

    let result = await filterEmployeesByDepartmentAndMaxExperience(
      department,
      maxExperience
    );

    if (result.employees.length === 0) {
      return res.status(404).json({
        message:
          "No employees found in the given department with the specified experience",
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch employees by salary and order by descending order
async function filterEmployeesBySalary() {
  let query = "SELECT * FROM employees WHERE salary ORDER BY salary DESC";
  let responseQuery = await db.all(query, []);
  return { employees: responseQuery };
}
app.get("/employees/ordered-by-salary", async (req, res) => {
  try {
    let result = await filterEmployeesBySalary();

    if (result.employees.length === 0) {
      return res.status(404).json({ message: "No employees salry found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listening incoming requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
