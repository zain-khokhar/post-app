const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
email:({type:String, required:true, unique:true}),
password:({type:String, required:true})  
})
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }, {
    timestamps: true,
  });
  const User = mongoose.model('User', userSchema);
const UserCredentials = mongoose.model('UserCredentials', userschema);

module.exports = { User, UserCredentials };