const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: "foodie_app_database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connection established");
  else console.log("Connection failed");
})();

// fetch all restaurants
async function fetchRestaurants() {
  let query = "SELECT * FROM restaurants";
  let responseQuery = await db.all(query, []);
  return { restaurants: responseQuery };
}
app.get("/restaurants", async (req, res) => {
  const result = await fetchRestaurants();
  if (result.restaurants.length === 0) {
    return res.status(404).json({ message: "No restaurants found" });
  }
  res.status(200).json(result);
});

// fetch restaurant by id
async function fetchRestaurantById(id) {
  let query = "SELECT * FROM restaurants WHERE id =?";
  let responseQuery = await db.get(query, [id]);
  return { restaurant: responseQuery };
}
app.get("/restaurants/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchRestaurantById(id);
    if (result.restaurant === undefined) {
      return res.status(404).json({ message: "Restaurant not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch restaurant by cuisine
async function getRestaurantsByCuisine(cuisine) {
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  let responseQuery = await db.all(query, [cuisine]);
  return { restaurants: responseQuery }; // returns an array of restaurants with the given cuisine
}
app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await getRestaurantsByCuisine(cuisine);

    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found by this cuisine" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch restaurant by filter such as veg/none-veg, outdoor seating , luxury etc
async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    "SELECT * FROM restaurants WHERE isVeg =? AND hasOutdoorSeating =? AND isLuxury =?";
  let responseQuery = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: responseQuery }; // returns an array of restaurants with the given filter criteria
}
app.get("/restaurants/filter", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let result = await getRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found matching the filter criteria" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch restaurant sorted by rating hight to low
async function fetchRestaurantByRating() {
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let responseQuery = await db.all(query, []);
  return { restaurants: responseQuery }; // returns an array of restaurants sorted by rating in descending order
}
app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let result = await fetchRestaurantByRating();

    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all dishes from database
async function fetchAllDishes() {
  let query = "SELECT * FROM dishes";
  let responseQuery = await db.all(query, []);
  return { dishes: responseQuery }; // returns an array of all dishes in the database
}
app.get("/dishes", async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (!result.dishes) {
      return res.status(404).json({ message: "No dishes found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get dishes by if from database
async function fetchAllDishes(id) {
  let query = "SELECT * FROM dishes WHERE id = ?";
  let responseQuery = await db.get(query, [id]);
  return { dishes: responseQuery }; // returns an array of all dishes in the database
}
app.get("/dishes/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchAllDishes(id);
    if (!result.dishes) {
      return res.status(404).json({ message: "No dishes found by id" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Fetch dishes based on filters such as veg/non-veg.
async function fetchDishesByIsVeg(isVeg) {
  let query = "SELECT * FROM dishes WHERE isVeg = ?";
  let responseQuery = await db.all(query, [isVeg]);
  return { dishes: responseQuery };
}
app.get("/dishes/filter", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await fetchDishesByIsVeg(isVeg);
    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: "No dishes found matching the filter criteria" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Fetch dishes sorted by their price ( lowest to highest )
async function fetchDishesByPrice(){
    let query = "SELECT * FROM dishes ORDER BY price ASC";
    let responseQuery = await db.all(query, []);
    return { dishes: responseQuery };
}
app.get('/dishes/sort-by-price', async (req, res) => {
    try {
        let result = await fetchDishesByPrice()
        if (!result.dishes) {
            return res.status(404).json({ message: 'No dishes found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})


// listen incoming requests
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
