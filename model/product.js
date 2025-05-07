const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: {type:String,default:""},
    price: { type: Number, default:0 },
    stock: { type: Number, default: 0 },
    category:{type:String,default:""},
    image:{type:String,default:""},
    images: [String],
    isActive:{type:Boolean,default:true}
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('product', productSchema);
