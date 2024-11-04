const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./products_database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create a product_details table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      price REAL,
      stock INTEGER,
      brand TEXT,
      rating REAL,
      model TEXT
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Product details table created or already exists.');
      }
    }
  );

  // Insert random product data
  const stmt = db.prepare(
    'INSERT INTO products (name, category, price, stock, brand, rating, model) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const products = [
    {
      name: 'Smartphone XYZ',
      category: 'Electronics',
      price: 699.99,
      stock: 150,
      brand: 'BrandA',
      rating: 4.5,
      model: 'XYZ-2023',
    },
    {
      name: 'Wireless Headphones',
      category: 'Accessories',
      price: 199.99,
      stock: 250,
      brand: 'BrandB',
      rating: 4.7,
      model: 'WH-2022',
    },
    {
      name: 'Gaming Laptop',
      category: 'Computers',
      price: 1499.99,
      stock: 75,
      brand: 'BrandC',
      rating: 4.8,
      model: 'GL-2023',
    },
    {
      name: 'Bluetooth Speaker',
      category: 'Accessories',
      price: 89.99,
      stock: 200,
      brand: 'BrandB',
      rating: 4.2,
      model: 'BS-2021',
    },
    {
      name: '4K LED TV',
      category: 'Electronics',
      price: 799.99,
      stock: 100,
      brand: 'BrandA',
      rating: 4.6,
      model: 'TV-2022',
    },
  ];

  for (let product of products) {
    stmt.run(
      product.name,
      product.category,
      product.price,
      product.stock,
      product.brand,
      product.rating,
      product.model
    );
  }
  stmt.finalize();

  console.log('Inserted product details into the database.');

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
