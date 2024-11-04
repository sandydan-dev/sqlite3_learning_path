const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("./tracks_music_database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create a movies table with an additional actor and box_office_collection column
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      artist TEXT,
      genre TEXT,
      release_year INTEGER
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
    "INSERT INTO tracks (title, artist, genre, release_year) VALUES (?, ?, ?, ?)"
  );

  const tracks = [
    {
      id: 1,
      title: "Raabta",
      genre: "Romantic",
      release_year: 2012,
      artist: "Arijit Singh",
    },
    {
      id: 2,
      title: "Naina Da Kya Kasoor",
      genre: "Pop",
      release_year: 2018,
      artist: "Amit Trivedi",
    },
    {
      id: 3,
      title: "Ghoomar",
      genre: "Traditional",
      release_year: 2018,
      artist: "Shreya Ghoshal",
    },
    {
      id: 4,
      title: "Bekhayali",
      genre: "Rock",
      release_year: 2019,
      artist: "Sachet Tandon",
    },
    {
      id: 5,
      title: "Hawa Banke",
      genre: "Romantic",
      release_year: 2019,
      artist: "Darshan Raval",
    },
    {
      id: 6,
      title: "Ghungroo",
      genre: "Dance",
      release_year: 2019,
      artist: "Arijit Singh",
    },
    {
      id: 7,
      title: "Makhna",
      genre: "Hip-Hop",
      release_year: 2019,
      artist: "Tanishk Bagchi",
    },
    {
      id: 8,
      title: "Tera Ban Jaunga",
      genre: "Romantic",
      release_year: 2019,
      artist: "Tulsi Kumar",
    },
    {
      id: 9,
      title: "First Class",
      genre: "Dance",
      release_year: 2019,
      artist: "Arijit Singh",
    },
    {
      id: 10,
      title: "Kalank Title Track",
      genre: "Romantic",
      release_year: 2019,
      artist: "Arijit Singh",
    },
  ];

  for (let track of tracks) {
    stmt.run(track.title, track.artist, track.genre, track.release_year);
  }
  stmt.finalize();

  console.log("Inserted 10 music tracks into the database.");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
