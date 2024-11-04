const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "employee_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connection established");
})();

// get employee
async function fetchEmployees() {
  let query = "SELECT * FROM employees";
  let responseQuery = await db.all(query, []);

  return { employees: responseQuery };
}
app.get("/employees", async (req, res) => {
  try {
    let result = await fetchEmployees();

    if (result.employees.length === 0) {
      return res.status(404).json({ message: "employee details not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch movies by gender
async function fetchEmployeeByGender(gender) {
  let query = "SELECT * FROM employees WHERE gender = ?";
  let responseQuery = await db.all(query, [gender]);

  return { employees: responseQuery };
}
app.get("/employees/gender/:gender", async (req, res) => {
  try {
    let gender = req.params.gender;
    let result = await fetchEmployeeByGender(gender);

    if (result.employees.length === 0) {
      return res.status(404).json({ message: "employee not found by gender" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch employee by department
async function fetchEmployeeByDepartment(department) {
  let query = "SELECT * FROM employees WHERE department = ?";
  let responseQuery = await db.get(query, [department]);

  return { employees: responseQuery };
}
app.get("/employees/department/:department", async (req, res) => {
  try {
    let department = req.params.department;
    let result = await fetchEmployeeByDepartment(department);

    if (result.length === 0) {
      return res.status(404).json({ message: "employee department not found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch employees by location
async function fetchEmployeesByLocation(location){
    let query = "SELECT * FROM employees WHERE location = ?";
    let responseQuery = await db.get(query, [location]);
    
    return {employee : responseQuery}

}
app.get("/employees/location/:location", async (req, res) => {
  try {
    let location = req.params.location;
    let result = await fetchEmployeesByLocation(location);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "employees not found by location" });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log("Server running");
});
