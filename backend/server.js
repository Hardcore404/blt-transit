const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "bookings.json";

// Load existing data
let bookings = [];
if (fs.existsSync(FILE)) {
  bookings = JSON.parse(fs.readFileSync(FILE));
}

// Save function
function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(bookings, null, 2));
}

// ADD booking
app.post("/book", (req, res) => {
  bookings.push(req.body);
  saveData();
  res.send({ message: "Booked successfully" });
});

// GET bookings
app.get("/dashboard", (req, res) => {
  res.send(bookings);
});

// DELETE ONE
app.delete("/delete/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0 || index >= bookings.length) {
    return res.status(400).send({ error: "Invalid index" });
  }

  bookings.splice(index, 1);
  saveData();

  res.send({ message: "Deleted successfully" });
});

// DELETE ALL
app.delete("/delete-all", (req, res) => {
  bookings = [];
  saveData();

  res.send({ message: "All bookings deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));