const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  pickup: String,
  drop: String,
  distance: Number,
  carType: String,
  fare: Number,

  // Ride Mood
  rideMood: {
    type: String,
    enum: ["Silent", "Music", "Friendly", "Fastest"],
    default: "Silent"
  },

  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "on_the_way",
      "started",
      "completed",
      "cancelled",
      "expired",
      "assigned"
    ],
    default: "pending"
  },
  driverName: {
  type: String,
  default: null
},

carNumber: {
  type: String,
  default: null
},

driverPhone: {
  type: String,
  default: null
},

eta: {
  type: String,
  default: null
},

  
  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Card"]
  },

  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid"
  },

  
  cancelReason: String,

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },

  review: {
    type: String,
    default: ""
  },
  commission: {
    type: Number,
    default: 0
  },
  driverEarning:{
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports =
  mongoose.models.Ride || mongoose.model("Ride", rideSchema);
