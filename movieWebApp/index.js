const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

// Connect to SQLite database
(async () => {
  db = await open({
    filename: "movie_app_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log(" SQLite database connected");
})();

// fetch all movies
async function fetchAllMovies() {
  let query = "SELECT * FROM movies";

  let responseQuery = await db.all(query, []);

  if (!responseQuery) return null;
  return { movies: responseQuery };
}
app.get("/movies", async (req, res) => {
  try {
    let result = await fetchAllMovies();

    if (result.movies.length === 0) {
      res.status(404).json({ message: "No movies found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetch movies by genre
async function fetchMovieByGenre(genre) {
  let query = "SELECT * FROM movies WHERE genre = ?";
  let responseQuery = await db.get(query, [genre]);

  if (!responseQuery) return { message: "Movie genre not found from db" };
  return { movies: responseQuery };
}
app.get("/movies/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await fetchMovieByGenre(genre);

    if (result.movies.length === 0) {
      res.status(404).json({ message: "No movies found for this genre" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetch movies by id

async function fetchMovieById(id) {
  let query = "SELECT * FROM movies WHERE id = ?";
  let responseQuery = await db.get(query, [id]);

  if (!responseQuery) return { message: "movie id not found from db" };

  return { movies: responseQuery };
}
app.get("/movies/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchMovieById(id);

    if (result.movies === undefined) {
      return res.status(404).json({ message: "movie id not found" });
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetch movies by actor
async function fetchMoviesByActor(actor) {
  let query = "SELECT * FROM movies WHERE actor = ?";
  let responseQuery = await db.get(query, [actor]);

  return { movies: responseQuery };
}
app.get("/movies/actor/:actor", async (req, res) => {
  try {
    let actor = req.params.actor;

    let result = await fetchMoviesByActor(actor);

    if (result.movies.length === 0) {
      return res.status(404).json({ message: "movies actor not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SQL conparison operators

// filter movies by year and actor

async function fetchBySpecificActorAndReleaseYear(releaseYear, actor) {
  let query = "SELECT * FROM movies WHERE release_year = ? AND actor = ?";
  let responseQuery = await db.all(query, [releaseYear, actor]);
  return { movies: responseQuery };
}

app.get("/movies/year-actor", async (req, res) => {
  try {
    let releaseYear = parseInt(req.query.releaseYear);
    let actor = req.query.actor;

    let result = await fetchBySpecificActorAndReleaseYear(releaseYear, actor);

    if (result.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found by this year and actor" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get movies by award winning which is rating equal 4.5 or higher and ordered by assending order
async function filterMovieByHigherRatingAwardWinning() {
  let query = "SELECT * FROM movies WHERE rating >= 4.5 ORDER BY rating";
  let responseQuery = await db.all(query, []);
  return { movies: responseQuery };
}
app.get("/movies/award-winning", async (req, res) => {
  try {
    let result = await filterMovieByHigherRatingAwardWinning();
    if (result.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found with rating 4.5 or higher" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch blockbuster movies, and filter by  box_office collection more than 100  and order by box_office in descending order

async function filterMoviesByBoxOffice() {
  let query =
    "SELECT * FROM movies WHERE box_office_collection >= 100 ORDER BY box_office_collection DESC";
  let responseQuery = await db.all(query, []);
  return { movies: responseQuery };
}

app.get("/movies/blockbuster", async (req, res) => {
  try {
    let result = await filterMoviesByBoxOffice();
    if (result.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found that qualify as blockbusters" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listen incomming requests
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
