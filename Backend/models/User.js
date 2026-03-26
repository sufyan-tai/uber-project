const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "driver", "admin"]
  },
  carNumber: {
    type: String,
    default: "GJ-15-SA-1111"
  },
  isAvailable: {
    type: Boolean,
    default: true   
  },
  isOnline: {
  type: Boolean,
  default: false
}
}, { timestamps: true });
module.exports = mongoose.model("User", UserSchema);
