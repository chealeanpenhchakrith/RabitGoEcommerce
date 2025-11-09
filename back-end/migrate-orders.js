import { open } from "sqlite";
import sqlite3 from "sqlite3";

async function addOrdersTables() {
  console.log("Starting migration to add orders tables...");
  
  const db = await open({
    filename: "./ecommerce.sqlite",
    driver: sqlite3.Database,
  });

  try {
    // Create the orders table
    await db.exec(`CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )`);
    console.log("✓ Orders table created");

    // Create the order_items table
    await db.exec(`CREATE TABLE IF NOT EXISTS order_items (
      order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_price REAL NOT NULL,
      product_quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
    )`);
    console.log("✓ Order_items table created");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await db.close();
  }
}

addOrdersTables();
