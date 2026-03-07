const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  driverId: mongoose.Schema.Types.ObjectId,

  pickup: String,
  drop: String,
  carType: String,
  distance: Number,
  fare: Number,

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Started", "Completed", "Cancelled"],
    default: "Pending"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
