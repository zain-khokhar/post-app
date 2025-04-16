const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;
const postmodel = require('../models/Post');
const authmiddleware = require('../middleware/authmiddleware');
const User = require('../models/User');

if (!secretkey) {
    throw new Error('Secret key not found');
}


// Signup route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'email & password is required' });
    }
    try {
        const hashedpassword = await bcrypt.hash(password, 10);
        const newuser = new User({ email, password: hashedpassword });
        await newuser.save();
        res.status(200).json({ message: "successfully created user" });
    } catch (error) {
        res.status(400).json({ message: "error in sign up", error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(500).json({ message: "email & password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "user not found" });

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) return res.status(500).json({ message: "invalid credentials" });

        const token = jwt.sign({ userid: user._id }, secretkey, { expiresIn: '1h' });
        return res.json({ token });
    } catch (error) {
        return res.status(400).json({ message: "error in logging", error: error.message });
    }
});

// Create post route
router.post('/', async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description ) {
         console.log(title,description)    
        return res.status(400).json({ message: "title, description " });
    }
    try {
        const newpost = new postmodel({ title, description });    
        await newpost.save();
        console.log(newpost);
        res.status(200).json({ message: "successfully created post" });
    } catch (error) {
        res.status(400).json({ message: "error in creating post", error: error.message });
    }
});
// read post route
router.get('/', async (req, res) => {
    try {
        const posts = await postmodel.find();
        res.status(200).json({ posts });
    } catch (error) {
        res.status(400).json({ message: "error in reading post", error: error.message });
    }
});
// update post route
router.put('/:id',async (req,res)=>{
    const {title,description} = req.body;
    if(!title || !description){
        return res.status(400).json({message:"title & description is required in update post"})
    }
    try {
         const updatepost = await postmodel.findByIdAndUpdate(req.params.id,{title,description},{new:true});
         res.status(200).json({message:"successfully updated post",updatepost})
          
    } catch (error) {
        res.status(400).json({message:"error in updating post",error:error.message})
    }
});
// delete post route
router.delete('/:id', async (req,res)=>{
    try {
         const deletepost = await postmodel.findByIdAndDelete(req.params.id);
         res.status(200).json({message:"successfully deleted post",deletepost})
    } catch (error) {
        res.status(400).json({message:"error in deleting post",error:error.message})
    }

})

module.exports = router;