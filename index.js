// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const EventEmitter = require("node:events");
const emitter = new EventEmitter();
const passport = require("passport");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dhaivat:dhaivat123@taskmanager.xpkggk6.mongodb.net/task-manager-db?retryWrites=true&w=majority&appName=TaskManager"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Routes
app.use("/tasks", isLoggedIn, taskRoutes);
app.use("/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
