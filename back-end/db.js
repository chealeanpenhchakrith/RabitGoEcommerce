import { open } from "sqlite";
import sqlite3 from "sqlite3";

// Init the db instance to null
let dbInstance = null;

// Init a new database instance
export async function initDB() {
  dbInstance = await open({
    filename: "./ecommerce.sqlite",
    driver: sqlite3.Database,
  });

  // Create the product table
  await dbInstance.exec(`CREATE TABLE IF NOT EXISTS product (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    product_category TEXT NOT NULL,
    product_price REAL
  )`);

  // Create the cart table
  await dbInstance.exec(`CREATE TABLE IF NOT EXISTS cart (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    product_price REAL,
    product_category TEXT,
    product_quantity INTEGER
    )`);

  // Call this function to check if data have been inserted
  await seedProducts();
}

async function seedProducts() {
  const { count } = await dbInstance.get(
    "SELECT COUNT(*) AS count FROM product"
  );
  if (count > 0) {
    console.log("Seed skipped, count =", count);
    return;
  }
  // Insert 50 products in the product table
  await dbInstance.exec(`INSERT INTO product (product_id, product_name, product_category, product_price) VALUES
    (1,'Wireless Mouse','Electronics',19.99),
    (2,'Gaming Keyboard','Electronics',59.99),
    (3,'USB-C Charger','Electronics',24.50),
    (5,'4K Monitor 27”','Electronics',329.99),
    (6,'Portable SSD 1TB','Electronics',89.99),
    (7,'Smartphone Stand','Electronics',9.99),
    (8,'Bluetooth Speaker','Electronics',45.00),
    (9,'Webcam 1080p','Electronics',39.99),
    (10,'LED Desk Lamp','Home',25.49),
    (11,'Memory Foam Pillow','Home',32.00),
    (12,'Stainless Steel Water Bottle','Sports',18.75),
    (13,'Yoga Mat','Sports',22.99),
    (14,'Adjustable Dumbbell 20lb','Sports',54.00),
    (15,'Running Shoes','Clothing',74.99),
    (16,'Cotton T-Shirt','Clothing',12.50),
    (17,'Denim Jeans','Clothing',44.99),
    (18,'Winter Jacket','Clothing',119.00),
    (19,'Leather Wallet','Clothing',28.00),
    (20,'Science Fiction Novel','Books',14.99),
    (21,'Cookbook','Books',21.00),
    (22,'Notebook A5','Office',4.25),
    (23,'Gel Pen Set','Office',9.80),
    (24,'Wireless Presenter','Office',26.90),
    (25,'Ergonomic Office Chair','Office',199.00),
    (26,'All-Purpose Cleaner','Grocery',6.49),
    (27,'Organic Coffee Beans 1lb','Grocery',13.99),
    (28,'Green Tea 50ct','Grocery',7.99),
    (29,'Almond Protein Bar','Grocery',1.99),
    (30,'Facial Cleanser','Beauty',11.50),
    (31,'Moisturizing Lotion','Beauty',15.25),
    (32,'Shampoo 500ml','Beauty',8.99),
    (33,'Electric Toothbrush','Beauty',39.00),
    (34,'Kids Building Blocks Set','Toys',24.99),
    (35,'Action Figure','Toys',16.49),
    (36,'Board Game Classic','Toys',29.99),
    (37,'Plush Bear','Toys',14.50),
    (38,'Remote Control Car','Toys',34.99),
    (39,'Car Phone Mount','Automotive',13.75),
    (40,'Windshield Sun Shade','Automotive',17.40),
    (41,'LED Headlight Bulb Pair','Automotive',49.00),
    (42,'Tire Pressure Gauge','Automotive',9.60),
    (43,'Microfiber Wash Mitt','Automotive',6.99),
    (44,'Ceramic Coffee Mug','Home',8.25),
    (45,'Nonstick Frying Pan 12”','Home',27.99),
    (46,'Glass Food Storage Set','Home',33.50),
    (47,'Area Rug 5x7','Home',89.00),
    (48,'Wall Clock Minimalist','Home',19.49),
    (49,'Laptop Backpack','Clothing',54.95),
    (50,'Travel Power Bank 20K','Electronics',42.00);`);
}

// Export the database instance
export function getDB() {
  return dbInstance;
}
