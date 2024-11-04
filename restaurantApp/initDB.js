const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./recipes_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cuisine TEXT,
      main_ingredient TEXT,
      preparation_time INTEGER,
      difficulty TEXT,
      vegetarian TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Recipes table created or already exists.");
      }
    },
  );


  const stmt = db.prepare(
    "INSERT INTO recipes (cuisine, main_ingredient, preparation_time, difficulty, vegetarian) VALUES (?, ?, ?, ?, ?)",
  );

  let recipes = [
    {
      name: "Spaghetti Carbonara",
      cuisine: "Italian",
      main_ingredient: "Pasta",
      preparation_time: 20,
      difficulty: "Medium",
      vegetarian: "false",
    },
    {
      name: "Tacos",
      cuisine: "Mexican",
      main_ingredient: "Beef",
      preparation_time: 30,
      difficulty: "Easy",
      vegetarian: "false",
    },
    {
      name: "Sushi",
      cuisine: "Japanese",
      main_ingredient: "Fish",
      preparation_time: 50,
      difficulty: "Hard",
      vegetarian: "false",
    },
    {
      name: "Chicken Curry",
      cuisine: "Indian",
      main_ingredient: "Chicken",
      preparation_time: 40,
      difficulty: "Medium",
      vegetarian: "false",
    },
    {
      name: "Vegetable Stir Fry",
      cuisine: "Chinese",
      main_ingredient: "Vegetables",
      preparation_time: 25,
      difficulty: "Easy",
      vegetarian: "true",
    },
    {
      name: "Mushroom Risotto",
      cuisine: "Italian",
      main_ingredient: "Rice",
      preparation_time: 35,
      difficulty: "Medium",
      vegetarian: "true",
    },
    {
      name: "Falafel",
      cuisine: "Middle Eastern",
      main_ingredient: "Chickpeas",
      preparation_time: 45,
      difficulty: "Medium",
      vegetarian: "true",
    },
    {
      name: "Beef Stroganoff",
      cuisine: "Russian",
      main_ingredient: "Beef",
      preparation_time: 60,
      difficulty: "Hard",
      vegetarian: "false",
    },
    {
      name: "Pad Thai",
      cuisine: "Thai",
      main_ingredient: "Noodles",
      preparation_time: 30,
      difficulty: "Medium",
      vegetarian: "false",
    },
    {
      name: "Greek Salad",
      cuisine: "Greek",
      main_ingredient: "Vegetables",
      preparation_time: 15,
      difficulty: "Easy",
      vegetarian: "true",
    },
  ];

  for (let recipe of recipes) {
    stmt.run(
      recipe.cuisine,
      recipe.main_ingredient,
      recipe.preparation_time,
      recipe.difficulty,
      recipe.vegetarian,
    );
  }
  stmt.finalize();

  console.log("Inserted 10 recipes into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});