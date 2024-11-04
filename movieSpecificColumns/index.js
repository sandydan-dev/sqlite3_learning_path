const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "specific_movie_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log(" successful connection ");
})();

// get id, title, and release_year from movie database
async function getAllMovies() {
  let query = "SELECT id, title, release_year FROM movies";
  let responseQuery = await db.all(query, []);
  return { movies: responseQuery }; // return as array of objects
}
app.get("/movies", async (req, res) => {
  try {
    let result = await getAllMovies();

    if (result.movies.length === 0) {
      return res.status(404).json({ message: "No movies found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// select specific columns and get id, title, actor, and release_year from mvoies database where actor si 'xyz'

async function getMoviesBySpecificActor(actor) {
  let query =
    "SELECT id, title, actor, release_year FROM movies WHERE actor = ? ";

  let responseQuery = await db.all(query, [actor]);
  return { movies: responseQuery }; // return as object
}

app.get("/movies/actor/:actor", async (req, res) => {
  try {
    let actor = req.params.actor;
    let result = await getMoviesBySpecificActor(actor);

    if (result.movies.length === 0) {
      res
        .status(404)
        .json({ message: "No movies were found by specific actor" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get  id, title , director , and release_year from movie database where director ? is xyz
async function getMovieBySpecificDirector(director) {
  let query =
    "SELECT id, title, director, release_year FROM movies WHERE director = ?";
  let responseQuery = await db.all(query, [director]);

  return { movies: responseQuery };
}
app.get("/movies/director/:director", async (req, res) => {
  try {
    let director = req.params.director;
    let result = await getMovieBySpecificDirector(director);

    if (result.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies were found by specific director" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 


// listning incoming requests
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
