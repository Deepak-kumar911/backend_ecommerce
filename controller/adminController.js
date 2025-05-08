const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');
const Product = require("../model/product")
const multer = require('multer');
const { bucket } = require('../config/firebaseAdmin');

// Register
exports.register = async (req,res) => {
    const {username, password } = req.body;
    try {
        let admin = await Admin.findOne({ username});
        if (admin) return res.status(400).json({ message: 'Account already exists' });

        admin = new Admin({ username, password });
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        await admin.save();
        const payload = { _id: admin._id,role:"admin" };
        const token = jwt.sign(payload, process.env.ADMIN_SECRET_KEY);

        return res.status(200).json({ status: 1, message: 'Successfull register', token });
    } catch (err) {
      console.log(err);
      
        return res.status(500).json({ status: 0, message: 'Something went wrong', err });
    }
}

exports.login = async (req,res) => {
    const { username, password } = req.body;
    try {
        let admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: 'Account not found' });

        const isValidPassword = await bcrypt.compare(password, admin?.password);
        if (!isValidPassword) return res.status(400).json({ status: 0, message: 'Invaild username/password' });

        const payload = { _id: admin._id,role:"admin" };
        const token = jwt.sign(payload, process.env.ADMIN_SECRET_KEY);

        return res.status(200).json({ status: 1, message: 'Successfull login', token });
    } catch (err) {
      console.log(err);
        return res.status(500).json({ status: 0, message: 'Something went wrong', err });
    }
}

// Add product
exports.addOrCreateProduct = async (req, res) => {
  try {
    const {_id} = req.body
    let product
    if(_id){
     product = await Product.findOne({_id,isActive:true});  
     if(!product) res.status(404).json({status:0, message: 'Product not found'});
    }else{
        product = new Product({isActive:true});
    }
    const updateKeys = [ "title", "description", "price", "stock", "category", "image", "images", ]
    updateKeys?.forEach(key=>{
        if(req.body[key]){
            product[key] = req.body[key]
        }
    })
    await product.save();
    res.status(200).json({status:1, message: _id? "Successfull product update":'Successfully product created', data:product });
  } catch (err) {
    res.status(500).json({status:0, message: 'Server error', error: err.message });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.query.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({status:1, message:'Product deleted', data:product });
  } catch (err) {
    res.status(500).json({status:0, message: 'Server error', error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({status:1, message:'Product fetched', data:product });
  } catch (err) {
    res.status(500).json({status:0, message: 'Server error', error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
  
    const query = {
      title: { $regex: search, $options: "i" }
    };
  
    try {
      const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      const total = await Product.countDocuments(query);
  
      return res.json({
        status: 1,
        message: "Data fetched",
        data: products,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      res.status(500).json({ status: 0, message: 'Server error', error: err.message });
    }
  };
  
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const file = bucket.file(`products/${Date.now()}_${req.file.originalname}`);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error(err);
      return res.status(500).json({ message: 'Upload failed' });
    });

    stream.on('finish', async () => {
      // Make the file publicly accessible
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      res.status(200).json({ url: publicUrl,message:"Upload successfully" });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function fetchAndInsertProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    const bulkOps = products.map(product => ({
      insertOne: {
        document: {
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          stock: product.rating.count
        }
      }
    }));

    
    // const result = await Product.bulkWrite(bulkOps);

    console.log(`Inserted ${result.insertedCount} products into MongoDB.`);
  } catch (error) {
    console.error('Error inserting products:', error.message);
  }
}

// fetchAndInsertProducts()