const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ride = require('../models/Ride');
const PDFDocument = require("pdfkit");

router.get('/dashboard', async(req,res)=>{

try{

const users = await User.countDocuments({role:'user'});
const drivers = await User.countDocuments({role:'driver'});
const rides = await Ride.countDocuments();
const completed = await Ride.countDocuments({status:'completed'});
const cancelled = await Ride.countDocuments({status:'cancelled'});
const pending = await Ride.countDocuments({status:'pending'});
const active = await Ride.countDocuments({
status: { $in: ["accepted", "on_the_way", "started"] }
});
const expired = await Ride.countDocuments({ status: "expired" });

res.json({
users,
drivers,
rides,
completed,
cancelled,
pending,
active,
expired
});

}catch(err){
res.status(500).json(err);
}
});


router.get("/rides", async (req, res) => {
try{

const rides = await Ride.find()
.populate("userId","name email")
.populate("driverId","name email")
.sort({createdAt:-1});

res.json(rides);

}catch(err){
console.log("Admin rides error:",err);
res.status(500).json({message:"Server error"});
}
});


router.get("/users", async (req,res)=>{
try{

const users = await User.find({role:"user"})
.sort({createdAt:-1});

res.json(users);

}catch(err){
console.log("Admin users error:",err);
res.status(500).json({message:"Server error"});
}
});


router.get("/user/:id", async(req,res)=>{
const user = await User.findById(req.params.id);
res.json(user);
});


router.get("/user-rides/:id", async(req,res)=>{
const rides = await Ride.find({userId:req.params.id})
.sort({createdAt:-1});
res.json(rides);
});


router.get("/drivers", async (req,res)=>{
try{

const drivers = await User.find({role:"driver"})
.sort({createdAt:-1});

res.json(drivers);

}catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
});


router.get("/driver/:id", async (req,res)=>{
try{

const driver = await User.findById(req.params.id);
res.json(driver);

}catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
});


router.get("/driver-rides/:id", async (req,res)=>{
try{

const rides = await Ride.find({driverId:req.params.id})
.sort({createdAt:-1});

res.json(rides);

}catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
});


router.get("/driver-stats/:id", async (req,res)=>{
try{

const driverId = req.params.id;

const totalRides = await Ride.countDocuments({driverId});

const completed = await Ride.countDocuments({
driverId,
status:"completed"
});

const cancelled = await Ride.countDocuments({
driverId,
status:"cancelled"
});

const rides = await Ride.find({
driverId,
status:"completed"
});

let earnings = 0;

rides.forEach(r=>{
earnings += r.fare;
});

res.json({
totalRides,
completed,
cancelled,
earnings
});

}catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
});


router.patch("/assign-driver/:rideId", async (req,res)=>{
try{

const {driverId} = req.body;

const ride = await Ride.findById(req.params.rideId);

if(!ride){
return res.status(404).json({message:"Ride not found"});
}

ride.driverId = driverId;
ride.status = "assigned";

await ride.save();

res.json({message:"Driver assigned successfully",ride});

}catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
});


router.get("/reports", async (req,res)=>{

try{

const reports = await Ride.aggregate([
{
$group:{
_id:{
$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}
},
totalRides:{$sum:1},

completed:{
$sum:{
$cond:[{$eq:["$status","completed"]},1,0]
}
},

cancelled:{
$sum:{
$cond:[{$eq:["$status","cancelled"]},1,0]
}
},

revenue:{
$sum:{
$cond:[{$eq:["$status","completed"]},"$fare",0]
}
}

}
},
{$sort:{_id:-1}}
]);

res.json(reports);

}catch(err){
console.log(err);
res.status(500).json({error:"Report error"});
}

});
router.get("/reports/export", async (req, res) => {
  try {

    const reports = await Ride.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalRides: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          },
          revenue: { $sum: "$fare" }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    let csv = "Date,Total Rides,Completed,Cancelled,Revenue\n";

    reports.forEach(r => {
      csv += `${r._id},${r.totalRides},${r.completed},${r.cancelled},${r.revenue}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("ride-reports.csv");
    res.send(csv);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Export error" });
  }
});


router.get("/invoice/:rideId", async (req,res)=>{

try{

const ride = await Ride.findById(req.params.rideId)
.populate("userId")
.populate("driverId");

if(!ride){
return res.status(404).json({message:"Ride not found"});
}

const doc = new PDFDocument({margin:50});

res.setHeader("Content-Type","application/pdf");
res.setHeader("Content-Disposition","attachment; filename=ride-invoice.pdf");

doc.pipe(res);

doc
.fontSize(24)
.fillColor("#111")
.text("Ride Invoice",{align:"center"});

doc.moveDown();

doc.fontSize(14);

doc.text(`Ride ID: ${ride._id}`);
doc.text(`User: ${ride.userId?.name}`);
doc.text(`Driver: ${ride.driverId?.name || "Not Assigned"}`);
doc.text(`Pickup Location: ${ride.pickup}`);
doc.text(`Drop Location: ${ride.drop}`);

doc.moveDown();

doc.fontSize(16).text("Fare Details",{underline:true});
doc.moveDown();

const total = ride.fare + 15;

doc.fontSize(14);
doc.text(`Base Fare: Rs. ${ride.fare}`);
doc.text(`Platform Fee: Rs. 10`);
doc.text(`Tax: Rs. 5`);

doc.moveDown();

doc
.fontSize(18)
.fillColor("green")
.text(`Total Amount: Rs.${total}`);

doc.moveDown();

doc
.fontSize(12)
.fillColor("black")
.text(`Status: ${ride.status}`);

doc.text(`Date: ${ride.createdAt.toLocaleDateString()}`);

doc.moveDown();

doc.text("Thank you for riding with us!",{align:"center"});

doc.end();

}catch(err){

console.log(err);
res.status(500).json({error:"Invoice error"});
}
});


module.exports = router;