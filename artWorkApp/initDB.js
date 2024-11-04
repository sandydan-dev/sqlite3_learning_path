const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./artwork_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      artist TEXT,
      year INTEGER,
      medium TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Artworks table created or already exists.");
      }
    }
  );

  const stmt = db.prepare(
    "INSERT INTO artworks (title, artist, year, medium) VALUES (?, ?, ?, ?)"
  );

  const artworks = [
    {
      id: 1,
      title: "Starry Night",
      artist: "Vincent Van Gogh",
      year: 1889,
      medium: "Oil Painting",
    },
    {
      id: 2,
      title: "Mona Lisa",
      artist: "Leonardo Da Vinci",
      year: 1503,
      medium: "Oil Painting",
    },
    {
      id: 3,
      title: "Sunflowers",
      artist: "Vincent Van Gogh",
      year: 1888,
      medium: "Oil Painting",
    },
    {
      id: 4,
      title: "The Night Café",
      artist: "Vincent Van Gogh",
      year: 1889,
      medium: "Oil Painting",
    },
    {
      id: 5,
      title: "The Persistence of Memory",
      artist: "Salvador Dali",
      year: 1931,
      medium: "Oil Painting",
    },
    {
      id: 6,
      title: "The Scream",
      artist: "Edvard Munch",
      year: 1893,
      medium: "Oil Painting",
    },
    {
      id: 7,
      title: "Guernica",
      artist: "Pablo Picasso",
      year: 1937,
      medium: "Oil Painting",
    },
    {
      id: 8,
      title: "The Starry Night Over the Rhone",
      artist: "Vincent Van Gogh",
      year: 1888,
      medium: "Oil Painting",
    },
    {
      id: 9,
      title: "Girl with a Pearl Earring",
      artist: "Johannes Vermeer",
      year: 1665,
      medium: "Oil Painting",
    },
    {
      id: 10,
      title: "The Birth of Venus",
      artist: "Sandro Botticelli",
      year: 1486,
      medium: "Tempera",
    },
  ];

  for (let artwork of artworks) {
    stmt.run(artwork.title, artwork.artist, artwork.year, artwork.medium);
  }
  stmt.finalize();

  console.log("Inserted 10 artworks into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
