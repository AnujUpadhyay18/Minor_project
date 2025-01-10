const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  confirm_password: {
    type: String,
    required: true,
   
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
