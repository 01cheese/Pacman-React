const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    googleId:String,
    githubId: String,
    displayName:String,
    email:String,
    image:String,
    maxScore:Number,
    totalScore:Number,
    username: { type: String, unique: true },
},{timestamps:true});


const userdb = new mongoose.model("users",userSchema);

module.exports = userdb;