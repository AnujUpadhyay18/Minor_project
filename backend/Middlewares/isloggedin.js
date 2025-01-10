const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token; 

  try {     
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email }).select('-password');
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).send({ message: 'Unauthorized go to login first' });
  }
};

module.exports = isLoggedIn;