const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const port = 3000;

let db;
(async () => {
  db = await open({
    filename: "recipes_database.sqlite",
    driver: sqlite3.Database,
  });

  if (db) console.log("Connection established");
})();

// get all recipes
async function fetchAllRecipes() {
  let query = "SELECT * FROM recipes";
  let responseQuery = await db.all(query, []);
  return { recipes: responseQuery };
}
app.get("/recipes", async (req, res) => {
  try {
    let result = await fetchAllRecipes();

    if (!result) return res.status(404).json({ message: "No recipes found" });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch recipes by cuisine
async function fetchRecipeByCuisine(cuisine) {
  let query = "SELECT * FROM recipes WHERE cuisine =?";
  let responseQuery = await db.all(query, [cuisine]);
  return { recipes: responseQuery };
}
app.get("/recipes/cuisine/:cuisine", async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await fetchRecipeByCuisine(cuisine);

    if (result.recipes === undefined) {
      return res
        .status(404)
        .json({ message: "No recipes found by this cuisine" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch recipes main ingredients
async function fetchRecipesByIngredient(ingredients) {
  let query = `SELECT * FROM recipes WHERE main_ingredient = ?`;
  let responseQuery = await db.get(query, [ingredients]);
  return { recipes: responseQuery };
}
app.get("/recipes/main_ingredient/:main_ingredient", async (req, res) => {
  try {
    let ingredients = req.params.main_ingredient;
    let result = await fetchRecipesByIngredient(ingredients);

    if (!result.recipes === undefined) {
      return res
        .status(404)
        .json({ message: "No recipes found with this ingredient" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch by recipe preparation time
async function fetchRecipeByPreparationTime(time) {
  let query = `SELECT * FROM recipes WHERE preparation_time = ?`;
  let responseQuery = await db.all(query, [time]);
  return { recipes: responseQuery };
}
app.get("/recipes/preparation_time/:preparation_time", async (req, res) => {
  try {
    let time = parseInt(req.params.preparation_time);
    let result = await fetchRecipeByPreparationTime(time);

    if (result.recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found by this preparation time" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch by recipe difficulty level
async function fetchRecipeByDifficultyLevel(difficulty) {
  let query = `SELECT * FROM recipes WHERE difficulty = ?`;
  let responseQuery = await db.all(query, [difficulty]);
  return { recipes: responseQuery };
}
app.get("/recipes/difficulty/:difficulty", async (req, res) => {
  try {
    let difficulty = req.params.difficulty;
    let result = await fetchRecipeByDifficultyLevel(difficulty);

    if (result.recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found by this difficulty level" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch recipes by vegiterian
async function fetchRecipeByVegiterian(vegetarian){
    let query = `SELECT * FROM recipes WHERE vegetarian =?`;
    let responseQuery = await db.all(query, [vegetarian]);
    return { recipes: responseQuery };
  
}
app.get("/recipes/vegetarian/:vegetarian", async (req, res) => {
  try {
    let vegetarian = req.params.vegetarian;
    let result = await fetchRecipeByVegiterian(vegetarian);

    if (result.recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found by this vegiterian status" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listning incoming requests
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
