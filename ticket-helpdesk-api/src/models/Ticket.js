const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  title:{type:String,minlength:5},
  description:{type:String,minlength:10},
  status:{type:String,enum:["OPEN","IN_PROGRESS","RESOLVED","CLOSED"],default:"OPEN"},
  priority:{type:String,enum:["LOW","MEDIUM","HIGH"],default:"MEDIUM"},
  created_by:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  assigned_to:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:{createdAt:"created_at",updatedAt:false}})

module.exports = mongoose.model("Ticket",schema)