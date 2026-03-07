const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const driverRoutes = require('./routes/driver');
require("./config/db");

const Ride = require("./models/Ride");

const app = express();  

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/driver", require("./routes/driver"));
app.use("/api/rides", require("./routes/rides"));

app.get("/", (req, res) => {
  res.send("Backend Working Fine");
});

app.get("/api/ride/active/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const ride = await Ride.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      status: { $in: ["accepted", "on_the_way", "started"] } 
    }).sort({ createdAt: -1 });

    if (!ride) {
      return res.json(null);
    }

    res.json(ride);

  } catch (err) {
    console.error("Active ride error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
