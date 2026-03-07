const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ride = require("../models/Ride");

router.post("/book", async (req, res) => {
  try {

    const {
      userId,
      pickup,
      drop,
      distance,
      carType,
      fare,
      rideMood,
      paymentMethod
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const ride = new Ride({
      userId: new mongoose.Types.ObjectId(userId),
      pickup,
      drop,
      distance,
      carType,
      fare,
      rideMood: rideMood || "Silent",   
      paymentMethod,          
      paymentStatus: "unpaid",
      status: "pending"
    });

    await ride.save();
    setTimeout(async () => {

  const currentRide = await Ride.findById(ride._id);

  if (currentRide && currentRide.status === "pending") {

    currentRide.status = "expired";
    await currentRide.save();

    console.log("Ride expired:", currentRide._id);

  }

},15000);

    res.status(201).json(ride);

  } catch (err) {
    console.error("Book Ride Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const rides = await Ride.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ createdAt: -1 });

    res.json(rides);

  } catch (err) {
    console.error("History Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/cancel/:id", async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ride id" });
    }

    await Ride.findByIdAndUpdate(req.params.id, {
      status: "cancelled"
    });

    res.json({ message: "Ride cancelled successfully" });

  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
