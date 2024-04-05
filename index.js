const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://dhaivat:desai123@taskmanager.icxb7nq.mongodb.net/?retryWrites=true&w=majority";
const corsOptions = {
  origin: 'http://localhost:5173/',//(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors());
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
};

// Connect to MongoDB
connectToDatabase();

// Routes
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
