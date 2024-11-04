const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const port = 3000;

let db;

// Connect to SQLite database
(async () => {
  db = await open({
    filename: "books_store_db.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connection established");
})();

// get all books details
async function getAllBooksDetails() {
  let query = "SELECT * FROM books";
  let responseQuery = await db.all(query, []);
  return { books: responseQuery };
}
app.get("/books", async (req, res) => {
  let result = await getAllBooksDetails();

  res.status(200).json(result);
});

// get books by author
async function getAllBooksByAuthor(author) {
  let query = "SELECT * FROM books WHERE author = ?";
  let responseQuery = await db.get(query, [author]);

  if (!responseQuery) {
    return { book: "not found by author" };
  }

  return { book: responseQuery }; // return book details if found, else return empty object  }
}
app.get("/books/author/:author", async (req, res) => {
  let author = req.params.author;
  let result = await getAllBooksByAuthor(author);

  res.status(200).json(result);
});

// get books by genre
async function getBooksByGenre(genre) {
  let query = "SELECT * FROM books WHERE genre = ?";
  let responseQuery = await db.get(query, [genre]);

  if (!responseQuery) {
    return { message: "No books found" };
  } else {
    return { booksGenre: responseQuery };
  }
}
app.get("/books/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await getBooksByGenre(genre);
    if (result.length === 0) {
      res.status(404).json({ message: "Books Genre not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// get books by publication year
async function getBooksByPublicationYear(year) {
  let query = "SELECT * FROM books WHERE publication_year = ?";
  let responseQuery = await db.get(query, [year]);

  if (!responseQuery) {
    return { message: "No Publication books found" };
  }
  return { booksPublicationYear: responseQuery }; // return book details
}
app.get("/books/publication_year/:year", async (req, res) => {
  try {
    let year = req.params.year;
    let result = await getBooksByPublicationYear(year);

    if (result.length === 0) {
      return { message: "Publicatin year not found" };
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// listening incoming incomming request
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
