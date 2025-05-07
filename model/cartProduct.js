const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cart'
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

module.exports = mongoose.model('cart_product', cartSchema);
