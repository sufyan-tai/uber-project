const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ride = require('../models/Ride');
const User = require('../models/User');

router.get('/pending-rides/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await User.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (!driver.isOnline || !driver.isAvailable) {
      return res.json([]);
    }

    const rides = await Ride.find({ status: 'pending' });

    res.json(rides);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/accept/:rideId/:driverId', async (req, res) => {
  try {
    const { rideId, driverId } = req.params;

    const ride = await Ride.findById(rideId);
    const driver = await User.findById(driverId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    if (!driver.isOnline || !driver.isAvailable) {
      return res.status(400).json({ message: "Driver not available" });
    }

    ride.status = "accepted";
    ride.driverId = driverId;
    ride.driverName = driver.name;
    ride.driverPhone = driver.phone || "N/A";
    ride.carNumber = driver.carNumber || "GJ-XX-XXXX";
    ride.eta = "5 mins";

    await ride.save();
    driver.isAvailable = false;
    await driver.save();

    res.json({ message: "Ride Accepted", ride });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/expire/:rideId', async (req, res) => {
  try {

    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status === "pending") {
      ride.status = "expired";
      await ride.save();
    }

    res.json({ message: "Ride expired" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/on-the-way/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "on_the_way";
    await ride.save();

    res.json({ message: "Driver is on the way", ride });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/start/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "started";
    await ride.save();

    res.json({ message: "Ride Started", ride });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/complete/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    const COMMISSION_RATE =0.1;
    const commission = ride.fare * COMMISSION_RATE;
    const driverEarning = ride.fare - commission;

    ride.status = "completed";
    ride.paymentStatus = "Paid";
    ride.commission= commission;
    ride.driverEarning = driverEarning;

    await ride.save();
    const driver = await User.findById(ride.driverId);
    if (driver) {
      driver.isAvailable = true;
      await driver.save();
    }

    res.json({ message: "Ride Completed", ride });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/cancel/:rideId', async (req, res) => {
  try {

    const { reason } = req.body;

    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // sirf accepted ya on_the_way ride cancel ho sakti hai
    if (ride.status === "accepted" || ride.status === "on_the_way" ||
        ride.status === "pending"
    ) {

      ride.status = "cancelled";
      ride.cancelReason = reason || "Driver Rejected";

      await ride.save();

      const driver = await User.findById(ride.driverId);

      if (driver) {
        driver.isAvailable = true;
        await driver.save();
      }

      return res.json({
        message: "Ride cancelled by driver",
        ride
      });

    }

    res.status(400).json({ message: "Ride cannot be cancelled" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/active/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    const ride = await Ride.findOne({
      driverId,
      status: { $in: ["accepted", "on_the_way", "started"] }
    }).sort({ createdAt: -1 });

    res.json(ride || null);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/set-offline/:driverId', async (req, res) => {
  try {
    const driver = await User.findById(req.params.driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.isOnline = false;
    await driver.save();

    res.json({ message: "Driver set offline" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/history/:driverId', async (req, res) => {
  const rides = await Ride.find({
    driverId: req.params.driverId,
    status: { $in:["completed","cancelled","expired"]}
  }).sort({ createdAt: -1 });

  res.json(rides);
});

router.get('/analytics/:driverId', async (req, res) => {
  try {

    const driverId = new mongoose.Types.ObjectId(req.params.driverId);

    const monthly = await Ride.aggregate([
      { $match: { driverId: driverId, status: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$fare" },
          rides: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weekly = await Ride.aggregate([
      {
        $match: {
          driverId: driverId,
          status: "completed",
          createdAt: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$fare" },
          rides: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      monthly,
      weekly
    });

  } catch (err) {
    console.log("Analytics Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/toggle-status/:driverId', async (req, res) => {
  try {
    const driver = await User.findById(req.params.driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.isOnline = !driver.isOnline;
    await driver.save();
    res.json({
      isOnline:driver.isOnline
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/dashboard/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    const total = await Ride.countDocuments({ driverId });
    const accepted = await Ride.countDocuments({ driverId, status: "accepted" });
    const started = await Ride.countDocuments({ driverId, status: "started" });
    const completed = await Ride.countDocuments({ driverId, status: "completed" });

    const completedRides = await Ride.find({
      driverId,
      status: "completed"
    });

    let totalFare = 0;
    let totalCommission = 0;
    let totalDriverEarning = 0;

    completedRides.forEach(r => {
      totalFare += r.fare || 0;
      totalCommission += r.commission || 0;
      totalDriverEarning += r.driverEarning || 0;
    });

    res.json({
      total,
      accepted,
      started,
      completed,
      totalFare,
      totalCommission,
      totalDriverEarning
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/ratings/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    const rides = await Ride.find({
      driverId,
      rating: { $ne: null }
    });

    const totalRatings = rides.length;

    let avgRating = 0;
    if (totalRatings > 0) {
      const sum = rides.reduce((acc, ride) => acc + ride.rating, 0);
      avgRating = sum / totalRatings;
    }

    const reviews = rides.map(r => ({
      rating: r.rating,
      review: r.review,
      pickup: r.pickup,
      drop: r.drop
    }));

    res.json({
      average: Number(avgRating.toFixed(1)),
      totalRatings,
      reviews 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/earnings/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    const completedRides = await Ride.find({
      driverId,
      status: "completed",
      paymentStatus: "Paid"
    });

    let total = 0;
    completedRides.forEach(r => total += r.fare);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRides = completedRides.filter(r =>
      new Date(r.createdAt) >= today
    );

    let todayEarnings = 0;
    todayRides.forEach(r => todayEarnings += r.fare);

    res.json({
      total,
      today: todayEarnings,
      completed: completedRides.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;