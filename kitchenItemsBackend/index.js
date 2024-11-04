const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "kitchen_items_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connection established");
  else console.log("Connection failed");
})();

// fetch kitchen item by max rating with given specified value
async function filterKitechItemBYmaxRang(maxRating) {
  let query = `SELECT * FROM kitchen_items WHERE rating > ?`;
  let responseQuery = await db.all(query, [maxRating]);
  return { kitchen_items: responseQuery };
}
app.get("/kitchen-items/rating", async (req, res) => {
  try {
    let maxRating = parseInt(req.query.maxRating);
    let result = await filterKitechItemBYmaxRang(maxRating);
    if (result.kitchen_items.length === 0) {
      return res
        .status(404)
        .json({ message: "No kitchen item found with minimum rating" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch kitchen items by material and rating and rating greater with given specified value
async function filterKitechItemBYMaterialAndRating(material, rating) {
  let query = `SELECT * FROM kitchen_items WHERE material =? AND rating > ?`;
  let responseQuery = await db.all(query, [material, rating]);
  return { kitchen_items: responseQuery };
}
app.get("/kitchen-items/material-rating", async (req, res) => {
  try {
    let material = req.query.material;
    let rating = parseInt(req.query.rating);

    let result = await filterKitechItemBYMaterialAndRating(material, rating);
    if (result.kitchen_items.length === 0) {
      return res.status(404).json({
        message: "No kitchen item found with this material and rating",
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch kitchen items by price and order by price in descending order
async function filterKitchenItemByPrice() {
  let query = "SELECT * FROM kitchen_items ORDER BY price DESC";
  let responseQuery = await db.all(query);
  return { kitchen_items: responseQuery };
}
app.get("/kitchen-items/ordered-by-price", async (req, res) => {
  try {
    let result = await filterKitchenItemByPrice();
    if (result.kitchen_items.length === 0) {
      return res.status(404).json({ message: "No kitchen items found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listening incoming requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
