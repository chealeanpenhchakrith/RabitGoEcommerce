import { open } from "sqlite";
import sqlite3 from "sqlite3";
import fs from "fs/promises";

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
    product_price REAL NOT NULL
  )`);

  // Create the users table
  await dbInstance.exec(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create the cart table (modified to include user_id)
  await dbInstance.exec(`CREATE TABLE IF NOT EXISTS cart (
    cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_price REAL NOT NULL,
    product_category TEXT NOT NULL,
    product_quantity INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
    )`);

  // Create the orders table
  await dbInstance.exec(`CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )`);

  // Create the order_items table
  await dbInstance.exec(`CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_price REAL NOT NULL,
    product_quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
  )`);

  // Create the image table
  await dbInstance.exec(`CREATE TABLE IF NOT EXISTS image (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_image BLOB)`);

  // Call this function to check if data have been inserted
  await seedProducts();
  await seedImages();
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
  await dbInstance.exec(`INSERT INTO product (product_name, product_category, product_price) VALUES
    ('Wireless Mouse','Electronics',19.99),
    ('Gaming Keyboard','Electronics',59.99),
    ('USB-C Charger','Electronics',24.50),
    ('4K Monitor 27','Electronics',329.99),
    ('Portable SSD 1TB','Electronics',89.99),
    ('Smartphone Stand','Electronics',9.99),
    ('Bluetooth Speaker','Electronics',45.00),
    ('Webcam 1080p','Electronics',39.99),
    ('LED Desk Lamp','Home',25.49),
    ('Memory Foam Pillow','Home',32.00),
    ('Stainless Steel Water Bottle','Sports',18.75),
    ('Yoga Mat','Sports',22.99),
    ('Adjustable Dumbbell 20lb','Sports',54.00),
    ('Running Shoes','Clothing',74.99),
    ('Cotton T-Shirt','Clothing',12.50),
    ('Denim Jeans','Clothing',44.99),
    ('Winter Jacket','Clothing',119.00),
    ('Leather Wallet','Clothing',28.00),
    ('Science Fiction Novel','Books',14.99),
    ('Cookbook','Books',21.00),
    ('Notebook A5','Office',4.25),
    ('Gel Pen Set','Office',9.80),
    ('Wireless Presenter','Office',26.90),
    ('Ergonomic Office Chair','Office',199.00),
    ('All-Purpose Cleaner','Grocery',6.49),
    ('Organic Coffee Beans 1lb','Grocery',13.99),
    ('Green Tea 50ct','Grocery',7.99),
    ('Almond Protein Bar','Grocery',1.99),
    ('Facial Cleanser','Beauty',11.50),
    ('Moisturizing Lotion','Beauty',15.25),
    ('Shampoo 500ml','Beauty',8.99),
    ('Electric Toothbrush','Beauty',39.00),
    ('Kids Building Blocks Set','Toys',24.99),
    ('Action Figure','Toys',16.49),
    ('Board Game Classic','Toys',29.99),
    ('Plush Bear','Toys',14.50),
    ('Remote Control Car','Toys',34.99),
    ('Car Phone Mount','Automotive',13.75),
    ('Windshield Sun Shade','Automotive',17.40),
    ('LED Headlight Bulb Pair','Automotive',49.00),
    ('Tire Pressure Gauge','Automotive',9.60),
    ('Microfiber Wash Mitt','Automotive',6.99),
    ('Ceramic Coffee Mug','Home',8.25),
    ('Nonstick Frying Pan 12”','Home',27.99),
    ('Glass Food Storage Set','Home',33.50),
    ('Area Rug 5x7','Home',89.00),
    ('Wall Clock Minimalist','Home',19.49),
    ('Laptop Backpack','Clothing',54.95),
    ('Travel Power Bank 20K','Electronics',42.00);`);
}

async function seedImages() {
  const { count } = await dbInstance.get("SELECT COUNT(*) AS count FROM image");
  if (count > 0) {
    console.log("Seed skipped, count =", count);
    return;
  }
  // Read 50 images
  const img_1 = await fs.readFile("./images/WirelessMouse.jpeg");
  const img_2 = await fs.readFile("./images/GamingKeyboard.jpeg");
  const img_3 = await fs.readFile("./images/USBCCharger.jpeg");
  const img_4 = await fs.readFile("./images/4KMonitor27.jpeg");
  const img_5 = await fs.readFile("./images/PortableSSD1TB.jpeg");
  const img_6 = await fs.readFile("./images/SmartphoneStand.jpeg");
  const img_7 = await fs.readFile("./images/BluetoothSpeaker.jpeg");
  const img_8 = await fs.readFile("./images/Webcam1080p.jpeg");
  const img_9 = await fs.readFile("./images/DeskLamp.jpeg");
  const img_10 = await fs.readFile("./images/MemoryFoamPillow.jpeg");
  const img_11 = await fs.readFile("./images/StainlessSteelWaterBottle.jpeg");
  const img_12 = await fs.readFile("./images/YogaMat.jpeg");
  const img_13 = await fs.readFile("./images/AdjustableDumbbell.jpeg");
  const img_14 = await fs.readFile("./images/RunningShoes.jpeg");
  const img_15 = await fs.readFile("./images/CottonTShirt.jpeg");
  const img_16 = await fs.readFile("./images/DenimJeans.jpeg");
  const img_17 = await fs.readFile("./images/WinterJacket.jpeg");
  const img_18 = await fs.readFile("./images/LeatherWallet.jpeg");
  const img_19 = await fs.readFile("./images/ScienceFictionNovel.jpeg");
  const img_20 = await fs.readFile("./images/Cookbook.jpeg");
  const img_21 = await fs.readFile("./images/NotebookA5.jpeg");
  const img_22 = await fs.readFile("./images/GelPenSet.jpeg");
  const img_23 = await fs.readFile("./images/WirelessPresenter.jpeg");
  const img_24 = await fs.readFile("./images/ErgonomicOfficeChair.jpeg");
  const img_25 = await fs.readFile("./images/AllPurposeCleaner.jpeg");
  const img_26 = await fs.readFile("./images/OrganicCoffeeBeans1lb.jpeg");
  const img_27 = await fs.readFile("./images/GreenTea50ct.jpeg");
  const img_28 = await fs.readFile("./images/AlmondProteinBar.jpeg");
  const img_29 = await fs.readFile("./images/FacialCleanser.jpeg");
  const img_30 = await fs.readFile("./images/MoisturizingLotion.jpeg");
  const img_31 = await fs.readFile("./images/Shampoo500ml.jpeg");
  const img_32 = await fs.readFile("./images/ElectricToothbrush.jpeg");
  const img_33 = await fs.readFile("./images/KidsBuildingBlocksSet.jpeg");
  const img_34 = await fs.readFile("./images/ActionFigure.jpeg");
  const img_35 = await fs.readFile("./images/BoardGameClassic.jpeg");
  const img_36 = await fs.readFile("./images/PlushBear.jpeg");
  const img_37 = await fs.readFile("./images/RemoteControlCar.jpeg");
  const img_38 = await fs.readFile("./images/CarPhoneMount.jpeg");
  const img_39 = await fs.readFile("./images/WindshieldSunShade.jpeg");
  const img_40 = await fs.readFile("./images/LEDHeadlightBulbPair.jpeg");
  const img_41 = await fs.readFile("./images/TirePressureGauge.jpeg");
  const img_42 = await fs.readFile("./images/MicrofiberWashMitt.jpeg");
  const img_43 = await fs.readFile("./images/CeramicCoffeeMug.jpeg");
  const img_44 = await fs.readFile("./images/NonstickFryingPan12.jpeg");
  const img_45 = await fs.readFile("./images/GlassFoodStorageSet.jpeg");
  const img_46 = await fs.readFile("./images/AreaRug5x7.jpeg");
  const img_47 = await fs.readFile("./images/WallClockMinimalist.jpeg");
  const img_48 = await fs.readFile("./images/LaptopBackpack.jpeg");
  const img_49 = await fs.readFile("./images/TravelPowerBank20K.jpeg");
  await dbInstance.run(
    `INSERT INTO image (product_image) VALUES (?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?), (?),(?),(?),(?)`,
    img_1,
    img_2,
    img_3,
    img_4,
    img_5,
    img_6,
    img_7,
    img_8,
    img_9,
    img_10,
    img_11,
    img_12,
    img_13,
    img_14,
    img_15,
    img_16,
    img_17,
    img_18,
    img_19,
    img_20,
    img_21,
    img_22,
    img_23,
    img_24,
    img_25,
    img_26,
    img_27,
    img_28,
    img_29,
    img_30,
    img_31,
    img_32,
    img_33,
    img_34,
    img_35,
    img_36,
    img_37,
    img_38,
    img_39,
    img_40,
    img_41,
    img_42,
    img_43,
    img_44,
    img_45,
    img_46,
    img_47,
    img_48,
    img_49
  );
}

// Export the database instance
export function getDB() {
  return dbInstance;
}
