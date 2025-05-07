const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    quantity: { type: Number, default:0 },
    price: { type: Number, default:0 },
    isActive:{type:Boolean,default:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model('order_product', orderProductSchema);
