const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;
const authmiddleware = require('../middleware/authmiddleware');
const User = require('../models/User');

if (!secretkey) {
    throw new Error('Secret key not found');
}
// signup route
router.post('/signup', async(req,res)=>{
  const {email,password} = req.body;
  if (!email || !password){
      return res.status(400).json({message:'email & password is required'})
  }
     try {
        const hashedpassword = await bcrypt.hash(password,10)
        if (!hashedpassword) {
            return res.status(500).json({message:"error in hashing password"})
        }
        const newuser = new User({email,password:hashedpassword})
        await newuser.save();
        if (!newuser) {
            return res.status(500).json({message:"error in creating in new user"})
        } 
        res.status(200).json({message:"successfully created user"})
    } catch (error) {
        res.status(400).json({message:"error in sign up",error:error.message})
     }
}); 
// login router
router.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    if (!email || !password) {
        return res.status(500).json({message:"email & password are required"})
    }
    try{
    const user = User.findOne({email}); 
    if (!user) {
        return res.status(400).json({message:"user not find"})
    }
    // matching password
    const ismatch = await bcrypt.compare(password,user.password)
      if (!ismatch){
        return res.status(500).json({message:"invalid credenstials"})
      }
   // generate the token
   const token = jwt.sign({userid:user._id},secretkey , {expiresIn:'1h'})
   return res.json({token}) 
    }catch(error){
        return res.status(400).json({message:"error in logging",error:error.message})
    }
})
router.get("/protected",authmiddleware,(req ,res)=>{
res.json({message:"this is protected route"})
} )
module.exports = router;

/*
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        } 
        // Check password
        const isMatch = await bcrypt.compare(password, user.password); // Await here
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate token
        const token = jwt.sign({ userid: user._id }, secretkey, { expiresIn: '1h' });
        res.json({ token }); // Response mein token bhejo
    } catch (error) {
        res.status(500).json({ message: "Error in login", error: error.message });
    }  
});

router.get('/protected', authmiddleware, (req, res) => {
    res.json({ message: "This is a protected route" });
});

/*const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;
const authmiddleware = require('../middleware/authmiddleware');
const User = require('../models/User');

if (!secretkey) { 
    throw new Error('Secret key not found');
}
// sign up route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email & password are required' });
    }  
    try {
        const hashedpassword = await bcrypt.hash(password, 10);
        if (!hashedpassword) {
            return res.status(500).json({ message: 'Error hashing password' });
        }
        const newuser = new User({ email, password: hashedpassword });
        await newuser.save();
        if (!newuser) { 
            res.status(500).json({ message: 'Error saving user' });
        } 

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error in creating user", error: error.message });
    }
});


module.exports = router;*/