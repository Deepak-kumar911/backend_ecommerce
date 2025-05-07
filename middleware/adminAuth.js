const jwt = require('jsonwebtoken');
const Admin = require("../model/admin")
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({status:0, message: 'Authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    if(decoded?._id){
        const admin = Admin.findOne({_id:decoded?._id,isActive:true},{password:-1})
        if(!admin) return  res.status(401).json({status:0, message: 'Account not found' });
        req.admin = admin;
        next();
    }else{
        return  res.status(401).json({status:0, message: 'Authorization denied' });
    }
  } catch (err) {
    res.status(401).json({status:0, message: 'Token is not valid' });
  }
};

module.exports = adminAuth;
