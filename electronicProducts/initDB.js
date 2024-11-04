const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./ecom_products_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create a products table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      brand TEXT,
      category TEXT,
      price REAL,
      rating REAL,
      stock TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Products table created or already exists.");
      }
    }
  );

  // Insert product data
  const stmt = db.prepare(
    "INSERT INTO products (name, brand, category, price, rating, stock) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const products = [
    {
      id: 1,
      name: "Wireless Mouse",
      brand: "Logitech",
      category: "Electronics",
      price: 25.99,
      rating: 4.5,
      stock: "out-of-stock",
    },
    {
      id: 2,
      name: "Bluetooth Headphones",
      brand: "Logitech",
      category: "Electronics",
      price: 89.99,
      rating: 4.7,
      stock: "in-stock",
    },
    {
      id: 3,
      name: "Sony WH-1000XM4",
      brand: "Sony",
      category: "Electronics",
      price: 348.0,
      rating: 4.8,
      stock: "out-of-stock",
    },
    {
      id: 4,
      name: "Sony PlayStation 5",
      brand: "Sony",
      category: "Gaming",
      price: 499.99,
      rating: 4.9,
      stock: "in-stock",
    },
    {
      id: 5,
      name: "Smartphone",
      brand: "Apple",
      category: "Electronics",
      price: 999.99,
      rating: 4.8,
      stock: "in-stock",
    },
    {
      id: 6,
      name: "4K Monitor",
      brand: "Samsung",
      category: "Electronics",
      price: 399.99,
      rating: 4.6,
      stock: "in-stock",
    },
    {
      id: 7,
      name: "Laptop Stand",
      brand: "Rain Design",
      category: "Accessories",
      price: 49.99,
      rating: 4.3,
      stock: "out-of-stock",
    },
    {
      id: 8,
      name: "USB-C Hub",
      brand: "Anker",
      category: "Accessories",
      price: 29.99,
      rating: 4.4,
      stock: "in-stock",
    },
    {
      id: 9,
      name: "Wireless Keyboard",
      brand: "Corsair",
      category: "Electronics",
      price: 79.99,
      rating: 4.5,
      stock: "in-stock",
    },
    {
      id: 10,
      name: "External Hard Drive",
      brand: "Western Digital",
      category: "Storage",
      price: 129.99,
      rating: 4.7,
      stock: "in-stock",
    },
  ];

  for (let product of products) {
    stmt.run(
      product.name,
      product.brand,
      product.category,
      product.price,
      product.rating,
      product.stock
    );
  }
  stmt.finalize();

  console.log("Inserted product details into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
