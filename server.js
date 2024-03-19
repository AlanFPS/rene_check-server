require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
// ENforce HTTPS node.js app with Heroku
const enforce = require("express-sslify");

app.use(enforce.HTTPS({ trustProtoHeader: true }));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// User model
const User = require("./models/User");

// Enhanced Route to create a new user with validation
app.post(
  "/users",
  [
    body("name").trim().not().isEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Email is not valid."),
    // More validations below in the future
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email } = req.body;
      const newUser = new User({ name, email });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.get("/", (req, res) => {
  res.send("Well hello!");
});

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
