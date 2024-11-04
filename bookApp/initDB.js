const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./bookapp_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create a books table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      year INTEGER,
      genre TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Books table created or already exists.");
      }
    }
  );

  // Insert sample book data
  const stmt = db.prepare(
    "INSERT INTO books (title, author, year, genre) VALUES (?, ?, ?, ?)"
  );

  const books = [
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      year: 1960,
      genre: "Fiction",
    },
    { title: "1984", author: "George Orwell", year: 1949, genre: "Fiction" },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: 1937,
      genre: "Fantasy",
    },
    {
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      year: 1954,
      genre: "Fantasy",
    },
    {
      title: "War and Peace",
      author: "Leo Tolstoy",
      year: 1869,
      genre: "Historical Fiction",
    },
    {
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      year: 1866,
      genre: "Novel",
    },
    {
      title: "The Brothers Karamazov",
      author: "Fyodor Dostoevsky",
      year: 1880,
      genre: "Novel",
    },
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      year: 2003,
      genre: "Mystery",
    },
    {
      title: "Angels & Demons",
      author: "Dan Brown",
      year: 2000,
      genre: "Mystery",
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      genre: "Fiction",
    },
  ];

  for (let book of books) {
    stmt.run(book.title, book.author, book.year, book.genre);
  }
  stmt.finalize();

  console.log("Inserted book details into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
