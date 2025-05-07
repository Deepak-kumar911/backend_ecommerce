const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, default:""},
  email: { type: String },
  username: { type: String,default:"" },
  password: { type: String, required: true },
  isActive:{type:Boolean,default:true}
},{timestamps:true});

module.exports = mongoose.model('user', UserSchema);