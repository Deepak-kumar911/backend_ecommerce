const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    amount: { type: Number, default:0 },
    isActive:{type:Boolean,default:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model('order', orderSchema);
