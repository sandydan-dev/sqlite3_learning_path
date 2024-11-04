const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const port = 3000;
const app = express();

// connect with db
let db;

(async () => {
  db = await open({
    filename: "tracks_music_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("db connection established");
})();

// fetch all tracks
async function getAllMusicTracs() {
  let query = "SELECT * FROM tracks";
  let responseQuery = await db.all(query, []);

  if (!responseQuery) {
    return { message: "No tracks found, please try again" };
  }

  return { tracks: responseQuery };
}
app.get("/tracks", async (req, res) => {
  try {
    let result = await getAllMusicTracs();

    if (result.length === 0) {
      res.status(404).json({ message: "No tracks found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

// get tracks by artist

async function getTrackByArtist(artist) {
  let query = "SELECT * FROM tracks WHERE artist = ?";
  let responseQuery = await db.get(query, [artist]);

  if (!responseQuery) {
    return { message: "No artist found" };
  }
  return { tracks: responseQuery };
}

app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await getTrackByArtist(artist);

    if (result.length === 0) {
      res.status(404).json({ message: "No tracks found by this artist" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// retrive tracks by genre
async function getTrackByGenre(genre) {
  let query = "SELECT * FROM tracks WHERE genre = ?";

  let responseQuery = await db.get(query, [genre]);

  if (!responseQuery) {
    return { message: "No tracks found by this genre" };
  }
  return { tracks: responseQuery };
}
app.get("/tracks/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await getTrackByGenre(genre);

    if (result.length === 0) {
      return { message: "Track Genre not found" };
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get track by release year
async function getTrackByReleaseYear(year) {
  let query = "SELECT * FROM tracks WHERE release_year = ?";
  let responseQuery = await db.get(query, [year]);
  if (!responseQuery) {
    return { message: "No tracks by release year can't find" };
  }
  return { tracks: responseQuery };
}
app.get("/tracks/release_year/:year", async (req, res) => {
  try {
    let year = req.params.year;
    let result = await getTrackByReleaseYear(year);

    if (result.length === 0) {
      return { message: "No tracks found by this release year" };
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listen incomming request
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
