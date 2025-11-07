import express from "express";
import { getDB, initDB } from "./db.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/products", async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    const rows = await db.all("SELECT * FROM product");
    res.json(rows);
  } catch (err) {
    console.error("GET /products failed:", err);
  }
});

(async () => {
  try {
    await initDB();
    console.log("DB initialized");
    app.listen(port, () => console.log(`App listening on port ${port}`));
  } catch (e) {
    console.error("DB init failed:", e);
  }
})();
