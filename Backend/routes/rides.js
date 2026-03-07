const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ride = require("../models/Ride");
const User = require("../models/User");

router.post("/book", async (req, res) => {
  try {
    const {
      userId,
      pickup,
      drop,
      carType,
      rideMood,
      paymentMethod
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const allowedLocations = [
      "TithalRoad",
      "Abrama",
      "Kosamba",
      "Nana Taiwad",
      "Mota Taiwad",
      "Green Park",
      "Railway Station"
    ];

    if (
      !allowedLocations.includes(pickup) ||
      !allowedLocations.includes(drop)
    ) {
      return res.status(400).json({
        message: "Service available within Valsad  only"
      });
    }

    if (pickup === drop) {
      return res.status(400).json({
        message: "Pickup and Drop cannot be same"
      });
    }
    const distanceMap = {
      "TithalRoad-Abrama": 10,
      "Abrama-Kosamba": 15,
      "Nana Taiwad-Green Park": 6,
      "Railway Station-TithalRoad": 10
    };

    const key = `${pickup}-${drop}`;
    const reverseKey = `${drop}-${pickup}`;

    let distance =
      distanceMap[key] ||
      distanceMap[reverseKey];

    if (!distance) {
      distance = 5; // default fallback
    }

    // 🔥 Fare Calculation
    let rate = 10;

    if (carType === "SUV") rate = 20;
    else if (carType === "Sedan") rate = 15;
    else if (carType === "Mini") rate = 10;

    const fare = distance * rate;

    const paymentStatus =
      paymentMethod === "Cash" ? "Unpaid" : "Paid";

    const ride = new Ride({
      userId: new mongoose.Types.ObjectId(userId),
      pickup,
      drop,
      distance,
      carType,
      fare,
      rideMood: rideMood || "Silent",
      paymentMethod,
      paymentStatus,
      status: "pending",
      rating: null,
      review: ""
    });

    await ride.save();

    res.status(201).json(ride);

  } catch (err) {
    console.error("Book Ride Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/user-history/:userId", async (req, res) => {
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
// DRIVER RIDE HISTORY (Completed Rides)
router.get('/history/:driverId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.driverId)) {
      return res.status(400).json({ message: "Invalid driverId" });
    }
    const rides = await Ride.find({
      driverId: req.params.driverId,
      status: "completed"
    })
      .populate({
        path: "userId",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    console.log('History Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/active/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const ride = await Ride.findOne({
      userId: new mongoose.Types.ObjectId(req.params.userId),
      status: {
        $in: ["pending", "accepted", "on_the_way", "started"]
      }
    });

    res.json(ride);

  } catch (err) {
    console.error("Active Ride Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ride id" });
    }

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled",
        cancelReason: req.body.cancelReason || null
      },
      { new: true }
    );

    res.json(ride);

  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/rate/:id", async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ride id" });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "completed") {
      return res.status(400).json({ message: "Ride not completed yet" });
    }

    ride.rating = rating;
    ride.review = review || "";

    await ride.save();

    res.json({ message: "Rating submitted successfully" });

  } catch (err) {
    console.error("Rating Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ride id" });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json(ride);

  } catch (err) {
    console.error("Single Ride Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;