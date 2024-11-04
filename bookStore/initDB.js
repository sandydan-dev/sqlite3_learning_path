const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./books_store_db.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      genre TEXT,
      publication_year INTEGER
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Movies table created or already exists.");
      }
    }
  );

  // Insert random movie data
  const stmt = db.prepare(
    "INSERT INTO books (title, author, genre, publication_year) VALUES (?, ?, ?, ?)"
  );

  let books = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      publication_year: 1960,
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      publication_year: 1949,
    },
    {
      id: 3,
      title: "Animal Farm",
      author: "George Orwell",
      genre: "Political Satire",
      publication_year: 1945,
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Fiction",
      publication_year: 1813,
    },
    {
      id: 5,
      title: "Green Eggs and Ham",
      author: "Dr. Seuss",
      genre: "Childrens literature",
      publication_year: 1960,
    },
  ];

  for (let book of books) {
    stmt.run(book.title, book.author, book.genre, book.publication_year);
  }
  stmt.finalize();

  console.log("Inserted 5 books added into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
