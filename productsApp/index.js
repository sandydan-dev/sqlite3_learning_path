const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "products_database.sqlite",
    driver: sqlite3.Database,
  });

  if (db) console.log("Connection established");
})();

// Get all products
async function fetchAllProducts() {
  let query = "SELECT * FROM products";
  let responseQuery = await db.all(query, []);
  return { products: responseQuery };
}
app.get("/products", async (req, res) => {
  try {
    let result = await fetchAllProducts();

    if (!result.length === 0) {
      res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch products by brand
async function fetchProductsByBrand(brand) {
  let query = "SELECT * FROM products WHERE brand = ?";
  let responseQuery = await db.all(query, [brand]);
  return { products: responseQuery };
}
app.get("/products/brand/:brand", async (req, res) => {
  try {
    let brand = req.params.brand;
    let result = await fetchProductsByBrand(brand);

    if (!result.length === 0) {
      res.status(404).json({ message: "No products found for this brand" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get product by rating
async function getProductByRating(rating) {
  let query = "SELECT * FROM products WHERE rating >= ?";
  let responseQuery = await db.all(query, [rating]);
  return { products: responseQuery };
}
app.get("/products/rating/:rating", async (req, res) => {
  try {
    let rating = parseFloat(req.params.rating);
    let result = await getProductByRating(rating);

    if (result.products.length === 0) {
      return res.status(404).json({ message: "recipes rating not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get product by stock
async function getProductByStock(stock) {
  let query = "SELECT * FROM products WHERE stock < ?";
  let responseQuery = await db.all(query, [stock]);
  return { products: responseQuery };
}
app.get("/products/stocks/:stock", async (req, res) => {
  try {
    let stock = parseInt(req.params.stock);
    let result = await getProductByStock(stock);
    if (result.products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this stock" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listing incoming request
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
