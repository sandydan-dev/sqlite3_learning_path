const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;
// connect with database

let db;
(async () => {
  db = await open({
    filename: "ecom_products_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log(" connection established ");
})();

// get all products from database
async function getAllProducts() {
  let query = "SELECT * FROM products";
  let responseQuery = await db.all(query, []);

  if (!responseQuery) {
    return { message: "No products found from database" };
  }

  return { products: responseQuery };
}
app.get("/products", async (req, res) => {
  try {
    let result = await getAllProducts();

    if (result.length === 0) {
      res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
});

// get products by brand
async function getProductsByBrand(brand) {
  let query = "SELECT * FROM  products WHERE brand = ?";
  let responseQuery = await db.get(query, [brand]);

  if (!responseQuery) {
    return { message: "From database no products found for this brand" };
  } else {
    return { products: responseQuery };
  }
}
app.get("/products/brand/:brand", async (req, res) => {
  try {
    let brand = req.params.brand;
    let result = await getProductsByBrand(brand);

    if (result.length === 0) {
      return res.status(404).send("Brand not found");
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ mesaage: error.message });
  }
});

// get products by category
async function getProductsByCategory(category) {
  let query = "SELECT * FROM products WHERE category = ?";
  let responseQuery = await db.get(query, [category]);
  if (!responseQuery) {
    return { message: "From Database the category not found" };
  }
  return { products: responseQuery };
}
app.get("/products/category/:category", async (req, res) => {
  try {
    let category = req.params.category;
    let result = await getProductsByCategory(category);

    if (result.length === 0) {
      return res.status(404).send("No products found for this category");
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get products which is in-stock
async function getProductsByStock(stock) {
  let query = `SELECT * FROM products WHERE stock = ?`;
  let responseQuery = await db.all(query, [stock]);

  if (!responseQuery) {
    return { message: "Out of stock products" };
  }
  return { products: responseQuery };
}
app.get("/products/stock/:stocks", async (req, res) => {
  try {
    let stock = req.params.stocks;
    let result = await getProductsByStock(stock);

    if (result.length === 0) {
     res.status(404).json({ message: "There is no stock" });
    }

     res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listning incomming request routes
app.listen(port, () => {
  console.log("Server is running");
});
