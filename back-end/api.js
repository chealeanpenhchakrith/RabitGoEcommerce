import express from "express";
import { getDB, initDB } from "./db.js";

// Create an express server
const app = express();
const port = 3000;

// Parse body into json
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Get the product endpoint
app.get("/product", async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    const rows = await db.all("SELECT * FROM product");
    res.json(rows);
  } catch (err) {
    console.error("GET /products failed:", err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// Get the cart endpoint
app.get("/cart", async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    const rows = await db.all("SELECT * FROM cart");
    res.json(rows);
  } catch (err) {
    console.error("GET /cart failed", err);
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
});

// Add a product in the cart
app.post("/cart", async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;
    const product_price = req.body.product_price;
    const product_category = req.body.product_category;
    const product_quantity = req.body.product_quantity;
    await db.run(
      `INSERT INTO cart (product_id, product_name, product_price, product_category, product_quantity) values (?, ?, ?, ?, ?)`,
      product_id,
      product_name,
      product_price,
      product_category,
      product_quantity
    );
    res.send(`Product id:${product_id} added successfuly to the cart`);
  } catch (err) {
    console.error("POST /cart failed");
    res.status(500).json({ error: "Failed to add product in the cart" });
  }
});

// Remove a product in the cart
app.delete("/cart/:id", async (req, res) => {
  try {
    const db = getDB();
    const product_id = req.params.id;
    await db.run(`DELETE FROM cart WHERE product_id = (?)`, product_id);
    res.send(`Product id:${product_id} removed succesfuly from the cart`);
  } catch (err) {
    console.error("DELETE /cart:id failed");
    res.status(500).json({ error: "Failed to delete product in the cart" });
  }
});

// Update the product quantity in the cart
app.put("/cart/:id", async (req, res) => {
  try {
    const db = getDB();
    const product_id = req.params.id;
    const product_quantity = req.body.product_quantity;
    await db.run(
      `UPDATE cart SET product_quantity = (?) WHERE product_id = (?)`,
      product_quantity,
      product_id
    );
    res.send(`Update id:${product_id} with quantity:${product_quantity}`);
  } catch (err) {
    console.error("UPDATE /cart:id failed");
    res.status(500).json({ error: "Failed to update product in the cart" });
  }
});

(async () => {
  try {
    await initDB();
    console.log("DB initialized");
    app.listen(port, () =>
      console.log(`App listening on port http://localhost:${port}/`)
    );
  } catch (e) {
    console.error("DB init failed:", e);
  }
})();
