const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let rfid = "";

// Homepage route
app.get("/", (req, res) => {
  res.send("RFID Server is running!");
});

// Receive RFID from ESP32
app.post("/api/rfid", (req, res) => {
  rfid = req.body.rfid;
  console.log("Received RFID:", rfid);
  res.json({ success: true });
});

// Send the latest RFID to React
app.get("/api/rfid", (req, res) => {
  res.json({ rfid });
});

app.listen(port, () => {
  console.log(`RFID server running on port ${port}`);
});
