const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "bookapp_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) {
    console.log("Connection established");
  } else {
    console.log("Failed to connect");
  }
})();

// get all books from database which return only id, title, and author.
async function getAllBooks() {
  const query = "SELECT id, title, author FROM books";
  const responseQuery = await db.all(query);
  return { books: responseQuery };
}
app.get("/books", async (req, res) => {
  try {
    const result = await getAllBooks();
    if (result.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// extract id , title , author, and year from databaes where specific author is xyz
async function getBookBySpecificAuthor(author) {
  let query = "SELECT id, title, author FROM books WHERE author = ?";
  let responseQuery = await db.all(query, [author]);
  return { books: responseQuery };
}
app.get("/books/author/:author", async (req, res) => {
  try {
    let author = req.params.author;
    let result = await getBookBySpecificAuthor(author);
    if (result.books.length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// extract id, title, author, and genre from database where specific genre is xyz
async function getBooksBySpecificGenre(genre) {
  let query = "SELECT id, title, author, genre FROM books WHERE genre =?";
  let responseQuery = await db.all(query, [genre]);
  return { books: responseQuery };
}
app.get("/books/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await getBooksBySpecificGenre(genre);
    if (result.books.length === 0) {
      return res.status(404).json({ message: "No books found by this genre" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// extract id, title, author, and year from database where specific genre is xyz
async function getBooksBySpecificGenre(year) {
    let query = "SELECT id, title, author, genre FROM books WHERE year =?";
    let responseQuery = await db.all(query, [year]);
    return { books: responseQuery };
  }
  app.get("/books/year/:year", async (req, res) => {
    try {
      let year = parseInt(req.params.year);
      let result = await getBooksBySpecificGenre(year);
      if (result.books.length === 0) {
        return res.status(404).json({ message: "No books found by this year" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// listing incoming requests
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
