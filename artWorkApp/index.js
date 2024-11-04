const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "artwork_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) {
    console.log("Connection established");
  } else {
    console.log("Failed to connect to database");
  }
})();

// get all artworkd

app.get("/artwork", async (req, res) => {
  try {
    let result = await getAllArtWorks();

    if (result.artwork.length === 0) {
      res.status(404).json({ message: "Artwork not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// extract id, title, artist, release_year from database where artist is xyz
async function getArtworksBySpecificArtist(artist) {
  let query = `SELECT id, title, artist, year FROM artworks WHERE artist =?`;
  let responseQuery = await db.all(query, [artist]);
  return { artwork: responseQuery };
}
app.get("/artworks/artist/:artist", async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await getArtworksBySpecificArtist(artist);

    if (result.length === 0) {
      res.status(404).json({ message: `Artwork by ${artist} not found` });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// extract id, title, artis, year get from database where specific year is 1234.
async function getArtworksBySpecificYear(year) {
  let query = `SELECT id, title, artist, year FROM artworks WHERE year =?`;
  let responseQuery = await db.all(query, [year]);
  return { artworks: responseQuery };
}
app.get("/artworks/year/:year", async (req, res) => {
  try {
    let year = req.params.year;
    let result = await getArtworksBySpecificYear(year);

    if (result.artworks.length === 0) {
      res
        .status(404)
        .json({ message: `Artwork released in ${year} not found` });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// extract id, title, artist, medium from database where specific  medium is xyz
async function getArtworksBySpecificMedium(medium) {
  let query = `SELECT id, title, artist, medium FROM artworks WHERE medium =?`;
  let responseQuery = await db.all(query, [medium]);
  return { artworks: responseQuery };
}
app.get("/artworks/medium/:medium", async (req, res) => {
  try {
    let medium = req.params.medium;
    let result = await getArtworksBySpecificMedium(medium);
    if (result.artworks.length === 0) {
      res
        .status(404)
        .json({ message: `Artwork by medium ${medium} not found` });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listning incoming request
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
