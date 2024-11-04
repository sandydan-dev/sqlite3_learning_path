const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "gaming_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connection established");
  else {
    console.log("Failed to connect to database");
  }
})();

// Fetch all games from the database
async function getAllGames() {
  let query = "SELECT * FROM games";
  let responseQuery = await db.all(query, []);
  return { games: responseQuery };
}
app.get("/games", async (req, res) => {
  try {
    let result = await getAllGames();
    if (result.games.length === 0) {
      res.status(404).json({ message: "No games found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all games by id from the database
async function getAllGames(id) {
  let query = "SELECT * FROM games WHERE id = ?";
  let responseQuery = await db.get(query, [id]);
  return { games: responseQuery };
}
app.get("/games/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await getAllGames(id);
    if (!result.games.length) {
      res.status(404).json({ message: "No games found by id" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch games based on their genre
async function getGamesByGenre(genre) {
  let query = "SELECT * FROM games WHERE genre = ?";
  let responseQuery = await db.all(query, [genre]);
  return { games: responseQuery };
}
app.get("/games/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await getGamesByGenre(genre);
    if (result.games.length === 0) {
      res.status(404).json({ message: "No games found by this genre" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch games based on their platform
async function getGamesByPlatform(platform) {
  let query = "SELECT * FROM games WHERE platform = ?";
  let responseQuery = await db.all(query, [platform]);
  return { games: responseQuery };
}
app.get("/games/platform/:platform", async (req, res) => {
  try {
    let platform = req.params.platform;
    let result = await getGamesByPlatform(platform);
    if (result.games.length === 0) {
      res.status(404).json({ message: "No games found by this platform" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch games sorted by their rating ( highest to lowest )
async function fetchGamesByRating() {
  let query = "SELECT * FROM games ORDER BY rating DESC";
  let responseQuery = await db.all(query, []);
  return { games: responseQuery };
}
app.get("/games/sort-by-rating", async (req, res) => {
  try {
    let result = await fetchGamesByRating();
    if (result.games.length === 0) {
      return res.status(404).json({ message: "No games found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Fetch all players from the database
async function getAllPlayers() {
  let query = "SELECT * FROM players";
  let responseQuery = await db.all(query, []);
  return { players: responseQuery };
}
app.get("/players", async (req, res) => {
  try {
    let result = await getAllPlayers();
    if (result.players.length === 0) {
      res.status(404).json({ message: "No players found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Fetch a specific player by their ID.
async function getAllPlayersById(id) {
  let query = "SELECT * FROM players WHERE id =?";
  let responseQuery = await db.get(query, [id]);
  return { players: responseQuery };
}
app.get("/players/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await getAllPlayersById(id);
    if (!result.players) {
      res.status(404).json({ message: "No players found by this ID" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch players based on their platform
async function getPlayersByPlatform(platforms) {
  let query = "SELECT * FROM players WHERE platform = ?";
  let responseQuery = await db.all(query, [platforms]);
  return { players: responseQuery };
}
app.get("/players/platform/:platform", async (req, res) => {
  try {
    let platforms = req.params.platform;
    let result = await getPlayersByPlatform(platforms);
    if (result.players.length === 0) {
      res.status(404).json({ message: "No players found by this platform" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch players sorted by their rating ( highest to lowest ).
async function getPlayersByRating() {
  let query = "SELECT * FROM players ORDER BY rating DESC";
  let responseQuery = await db.all(query, []);
  return { players: responseQuery };
}
app.get("/players/sort-by-rating", async (req, res) => {
  try {
    let result = await getPlayersByRating();
    if (result.players.length === 0) {
      return res.status(404).json({ message: "No players found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all tournaments from the database
async function fetchAllTournaments() {
  let query = "SELECT * FROM tournaments";
  let responseQuery = await db.all(query, []);
  return { tournaments: responseQuery };
}
app.get("/tournaments", async (req, res) => {
  try {
    let result = await fetchAllTournaments();
    if (!result.tournaments) {
      return res.status(404).json({ message: "No tournaments found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a specific tournament by its ID.
async function fetchTournamentById(id) {
  let query = "SELECT * FROM tournaments WHERE id =?";
  let responseQuery = await db.get(query, [id]);
  return { tournaments: responseQuery };
}
app.get("/tournaments/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchTournamentById(id);
    if (!result.tournaments) {
      return res
        .status(404)
        .json({ message: "No tournament found by this ID" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Fetch tournaments based on their game ID.
async function fetchTournamentById(gameId) {
  let query = "SELECT * FROM tournaments WHERE gameId =?";
  let responseQuery = await db.get(query, [gameId]);
  return { tournaments: responseQuery };
}
app.get("/tournaments/game/:id", async (req, res) => {
  try {
    let gameId = parseInt(req.params.id);
    let result = await fetchTournamentById(gameId);
    if (!result.tournaments) {
      return res
        .status(404)
        .json({ message: "No tournament found by this gaemID" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch tournaments sorted by their prize pool ( highest to lowest )
async function getTournamentsByPricePool() {
  let query = "SELECT * FROM tournaments ORDER BY prizePool DESC";
  let responseQuery = await db.all(query, []);
  return { tournaments: responseQuery };
}
app.get("/tournaments/sort-by-prize-pool", async (req, res) => {
  try {
    let result = await getTournamentsByPricePool();
    if (!result.tournaments) {
      return res.status(404).json({ message: "No tournaments found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listining incomming request
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
