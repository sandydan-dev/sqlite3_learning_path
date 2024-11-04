const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./kitchen_items_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create a kitchen_items table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS kitchen_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      brand TEXT,
      material TEXT,
      price REAL,
      rating REAL
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Kitchen Items table created or already exists.");
      }
    }
  );

  // Insert sample kitchen item data
  const stmt = db.prepare(
    "INSERT INTO kitchen_items (name, type, brand, material, price, rating) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const kitchenItems = [
    {
      name: "Spoon",
      type: "utensil",
      brand: "BrandA",
      material: "stainless steel",
      price: 5.99,
      rating: 3,
    },
    {
      name: "Chefs Knife",
      type: "knife",
      brand: "BrandB",
      material: "carbon steel",
      price: 49.99,
      rating: 4.8,
    },
    {
      name: "Non-Stick Frying Pan",
      type: "cookware",
      brand: "BrandC",
      material: "ceramic",
      price: 25.99,
      rating: 4,
    },
    {
      name: "Blender",
      type: "appliance",
      brand: "BrandD",
      material: "plastic",
      price: 99.99,
      rating: 3.9,
    },
    {
      name: "Cutting Board",
      type: "utensil",
      brand: "BrandE",
      material: "bamboo",
      price: 19.99,
      rating: 4.5,
    },
  ];

  for (let item of kitchenItems) {
    stmt.run(
      item.name,
      item.type,
      item.brand,
      item.material,
      item.price,
      item.rating
    );
  }
  stmt.finalize();

  console.log("Inserted kitchen item details into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
