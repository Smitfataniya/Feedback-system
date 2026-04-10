const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const Feedback = require("./models/Feedback");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/feedbackDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes

// Add feedback
app.post("/feedback", async (req, res) => {
  const feedback = new Feedback(req.body);
  await feedback.save();
  res.send("Feedback Saved");
});

// Get all feedback
app.get("/feedback", async (req, res) => {
  const data = await Feedback.find().sort({ date: -1 });
  res.json(data);
});

// Delete feedback
app.delete("/feedback/:id", async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});