const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Refresh",
      "cache",
    ],
  })
);
app.use(express.static("public"));
app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("MongoDB connected successfully");
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coins: {
    BTC: { type: Number, default: 0 },
    ETH: { type: Number, default: 0 },
    USDT: { type: Number, default: 0 },
    DOGE: { type: Number, default: 0 },
    BNB: { type: Number, default: 0 },
    SOL: { type: Number, default: 0 },
    TRON: { type: Number, default: 0 },
    XRP: { type: Number, default: 0 },
  },
  profilePicture: { type: String, default: "default.jpg" },
  isAdmin: { type: Boolean, default: false }, // New field for admin role
  balance: { type: Number, default: 0 }, // New balance property
});

const User = mongoose.model("User", userSchema);

// Middleware to verify JWT token
function isAuthorized(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = { userId: decoded.userId, isAdmin: decoded.isAdmin };
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Unauthorized");
  }
}

// Middleware to verify admin status
function isAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).send("Forbidden");
  }
  next();
}

// Check Admin Status Route
app.get("/user/check-admin", isAuthorized, (req, res) => {
  if (req.user.isAdmin) {
    res.send("User is admin");
  } else {
    res.status(403).send("User is not admin");
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Register Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      coins: {
        BTC: 0,
        ETH: 0,
        USDT: 0,
        DOGE: 0,
        BNB: 0,
        SOL: 0,
        TRON: 0,
        XRP: 0,
      }, // Initialize with default coin amounts
      balance: 0, // Initialize balance
    });
    await newUser.save();
    console.log("New User:", newUser); // Log the newly created user
    res.status(201).send("User registered");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Failed to register user");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret");
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Failed to log in");
  }
});

// Fetch User Coin Amounts
app.get("/user/coins", isAuthorized, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({ coins: user.coins });
  } catch (error) {
    console.error("Error fetching user coins:", error);
    res.status(500).send("Failed to fetch user coins");
  }
});

// Fetch User Profile
app.get("/user/profile", isAuthorized, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      balance: user.balance, // Include balance in response
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Failed to fetch profile");
  }
});

// Update User Profile
app.put(
  "/user/profile",
  isAuthorized,
  upload.single("profilePicture"),
  async (req, res) => {
    const { username, email } = req.body;
    const profilePicture = req.file ? req.file.filename : undefined;

    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      user.username = username || user.username;
      user.email = email || user.email;
      user.profilePicture = profilePicture || user.profilePicture;
      await user.save();
      res.send("Profile updated");
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).send("Failed to update profile");
    }
  }
);

// Reset Password
app.post("/user/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send("Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Failed to reset password");
  }
});

// Admin Route to Edit User Details
app.put("/admin/user/:id", isAuthorized, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, email, coins, balance } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.coins = coins || user.coins;
    user.balance = balance !== undefined ? parseFloat(balance) : user.balance; // Update balance
    await user.save();
    res.send("User details updated");
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).send("Failed to update user details");
  }
});

// Admin Route to Update User Coin Amounts
app.put("/admin/user/:id/coins", isAuthorized, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { btc, eth, usdt, doge, bnb, sol, tron, xrp } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.coins.BTC = btc !== undefined ? parseFloat(btc) : user.coins.BTC;
    user.coins.ETH = eth !== undefined ? parseFloat(eth) : user.coins.ETH;
    user.coins.USDT = usdt !== undefined ? parseFloat(usdt) : user.coins.USDT;
    user.coins.DOGE = doge !== undefined ? parseFloat(doge) : user.coins.DOGE;
    user.coins.BNB = bnb !== undefined ? parseFloat(bnb) : user.coins.BNB;
    user.coins.SOL = sol !== undefined ? parseFloat(sol) : user.coins.SOL;
    user.coins.TRON = tron !== undefined ? parseFloat(tron) : user.coins.TRON;
    user.coins.XRP = xrp !== undefined ? parseFloat(xrp) : user.coins.XRP;
    await user.save();
    res.send("User coin amounts updated");
  } catch (error) {
    console.error("Error updating user coin amounts:", error);
    res.status(500).send("Failed to update user coin amounts");
  }
});

app.get("/admin/users", isAuthorized, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from response
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Failed to fetch users");
  }
});

// Admin Route to Register New Admin User
app.post("/admin/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: true, // Set as admin
      coins: {
        BTC: 0,
        ETH: 0,
        USDT: 0,
        DOGE: 0,
        BNB: 0,
        SOL: 0,
        TRON: 0,
        XRP: 0,
      }, // Initialize with default coin amounts
       balance: 0, // Initialize balance
    });
    await newAdmin.save();
    console.log("New Admin User:", newAdmin); // Log the newly created admin user
    res.status(201).send("Admin user registered");
  } catch (error) {
    console.error("Error registering admin user:", error);
    res.status(500).send("Failed to register admin user");
  }
});

// Admin Login Route
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid || !user.isAdmin) {
      return res.status(400).send("Invalid email or password");
    }
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      "your_jwt_secret"
    );
    res.json({ token });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).send("Failed to log in admin");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
