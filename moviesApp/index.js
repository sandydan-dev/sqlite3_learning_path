// requrire or get express
const express = require("express");

// require database here
const sqlite3 = require("sqlite3").verbose();
// use method open db
const { open } = require("sqlite");

// creating instance of express
const app = express();
const port = 3000;

// initialize db globel variable
let db;
// connect to sqlite database  // use iffe function to call every time
(async () => {
  db = await open({ filename: "database.sqlite", driver: sqlite3.Database });
  if (db) console.log("Database connection established");
})();

// create endpoint '/movies' that fetch  all movies
async function getAllMovies() {
  let query = "SELECT * FROM movies";
  // get all movies
  let responseQuery = await db.all(query, []);

  // return as object
  return { movies: responseQuery };
}
app.get("/movies", async (req, res) => {
  let result = await getAllMovies();

  res.status(200).json(result);
});

// get movies by genre

async function getMoviesByGenre(genre) {
  let query = "SELECT * FROM movies WHERE genre = ?";
  let responseQuery = await db.all(query, [genre]);
  return { movies: responseQuery }; // return as object
}

app.get("/movies/genre/:genre", async (req, res) => {
  const genre = req.params.genre;
  const result = await getMoviesByGenre(genre);

  res.status(200).json(result);
});


// get movies by id
async function getMoviesById(id){
    let query = "SELECT * FROM movies WHERE id = ?";
    let responseQuery = await db.get(query,[id])
    return { movie : responseQuery}
}
app.get('/movies/details/:id', async (req, res) => {
    let id = req.params.id;
    let result = await getMoviesById(id);
    res.status(200).json(result)
})


// get movies by release_year
async function getMoviesByReleaseYear(year){
    let query = "SELECT * FROM movies WHERE release_year = ?"
    let responseQuery = await db.all(query,[year])
    return { movies : responseQuery}  // return as object
}
app.get('/movies/release_year/:year', async (req, res) => {
    let year = req.params.year;
    let result = await getMoviesByReleaseYear(year)

    res.status(200).json(result)
})


// port listining on incomming request
app.listen(port, () => {
  console.log("Server listening on port 3000");
});
