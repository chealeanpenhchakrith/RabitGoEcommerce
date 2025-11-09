import express from "express";
import { getDB, initDB } from "./db.js";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";

// Create an express server
const app = express();
const port = 3000;

// Parse body into json
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

// Auth endpoints
// Register a new user
app.post("/auth/register", async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert the new user
    const result = await db.run(
      `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
      username,
      email,
      passwordHash
    );
    
    // Create session
    req.session.userId = result.lastID;
    req.session.username = username;
    
    res.json({ 
      message: "User registered successfully",
      user: {
        id: result.lastID,
        username,
        email
      }
    });
  } catch (err) {
    console.error("POST /auth/register failed:", err);
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Failed to register user" });
    }
  }
});

// Login user
app.post("/auth/login", async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    // Find the user
    const user = await db.get(
      `SELECT * FROM users WHERE username = ?`,
      username
    );
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Create session
    req.session.userId = user.user_id;
    req.session.username = user.username;
    
    res.json({ 
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("POST /auth/login failed:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Logout user
app.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ message: "Logout successful" });
  });
});

// Get current user
app.get("/auth/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const db = getDB();
  db.get(
    `SELECT user_id, username, email FROM users WHERE user_id = ?`,
    req.session.userId
  )
  .then(user => {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  })
  .catch(err => {
    console.error("GET /auth/me failed:", err);
    res.status(500).json({ error: "Failed to get user info" });
  });
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

// Get the cart endpoint (protected)
app.get("/cart", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    const rows = await db.all(
      "SELECT * FROM cart WHERE user_id = ?",
      req.session.userId
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /cart failed", err);
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
});

// Add a product in the cart (protected)
app.post("/cart", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;
    const product_price = req.body.product_price;
    const product_category = req.body.product_category;
    const product_quantity = req.body.product_quantity;
    
    // Check if product already exists in user's cart
    const existing = await db.get(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
      req.session.userId,
      product_id
    );
    
    if (existing) {
      // Update quantity if already exists
      await db.run(
        `UPDATE cart SET product_quantity = product_quantity + ? WHERE user_id = ? AND product_id = ?`,
        product_quantity,
        req.session.userId,
        product_id
      );
      res.json({ message: `Product quantity updated in cart` });
    } else {
      // Insert new product
      await db.run(
        `INSERT INTO cart (user_id, product_id, product_name, product_price, product_category, product_quantity) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        req.session.userId,
        product_id,
        product_name,
        product_price,
        product_category,
        product_quantity
      );
      res.json({ message: `Product added successfully to cart` });
    }
  } catch (err) {
    console.error("POST /cart failed:", err);
    res.status(500).json({ error: "Failed to add product in the cart" });
  }
});

// GET the product image
app.get("/image/:id", async (req, res) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not initialized");
    const row = await db.get(
      "SELECT product_image FROM image WHERE image_id = ?",
      req.params.id
    );
    res.type("image/jpeg").send(row.product_image);
  } catch (err) {
    console.error("GET /product/:id/image failed:", err);
    res.sendStatus(500);
  }
});

// Remove a product in the cart (protected)
app.delete("/cart/:id", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const product_id = req.params.id;
    await db.run(
      `DELETE FROM cart WHERE product_id = ? AND user_id = ?`,
      product_id,
      req.session.userId
    );
    res.json({ message: `Product removed successfully from cart` });
  } catch (err) {
    console.error("DELETE /cart:id failed");
    res.status(500).json({ error: "Failed to delete product in the cart" });
  }
});

// Update the product quantity in the cart (protected)
app.put("/cart/:id", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const product_id = req.params.id;
    const product_quantity = req.body.product_quantity;
    await db.run(
      `UPDATE cart SET product_quantity = ? WHERE product_id = ? AND user_id = ?`,
      product_quantity,
      product_id,
      req.session.userId
    );
    res.json({ message: `Product quantity updated` });
  } catch (err) {
    console.error("UPDATE /cart:id failed");
    res.status(500).json({ error: "Failed to update product in the cart" });
  }
});

// Create order from cart (protected)
app.post("/orders", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    
    // Get cart items
    const cartItems = await db.all(
      `SELECT * FROM cart WHERE user_id = ?`,
      req.session.userId
    );
    
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    
    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (item.product_price * item.product_quantity), 0
    );
    
    // Create order
    const orderResult = await db.run(
      `INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`,
      req.session.userId,
      totalAmount
    );
    
    const orderId = orderResult.lastID;
    
    // Insert order items
    for (const item of cartItems) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, product_name, product_price, product_quantity) 
         VALUES (?, ?, ?, ?, ?)`,
        orderId,
        item.product_id,
        item.product_name,
        item.product_price,
        item.product_quantity
      );
    }
    
    // Clear cart
    await db.run(
      `DELETE FROM cart WHERE user_id = ?`,
      req.session.userId
    );
    
    res.json({ 
      message: "Order created successfully",
      order_id: orderId,
      total_amount: totalAmount
    });
  } catch (err) {
    console.error("POST /orders failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get user orders (protected)
app.get("/orders", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.all(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      req.session.userId
    );
    res.json(orders);
  } catch (err) {
    console.error("GET /orders failed:", err);
    res.status(500).json({ error: "Failed to get orders" });
  }
});

// Get order details with items (protected)
app.get("/orders/:id", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const order = await db.get(
      `SELECT * FROM orders WHERE order_id = ? AND user_id = ?`,
      req.params.id,
      req.session.userId
    );
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const items = await db.all(
      `SELECT * FROM order_items WHERE order_id = ?`,
      req.params.id
    );
    
    res.json({ ...order, items });
  } catch (err) {
    console.error("GET /orders/:id failed:", err);
    res.status(500).json({ error: "Failed to get order details" });
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
