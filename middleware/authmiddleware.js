const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;
const authmiddleware = (req,res,next)=>{
    const token = req.body;
    if(!token){
        return res.status(401).json({message:"unauthorized"})
    }
    try {
        const decoded = jwt.decode(token.split('')[1] , secretkey)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message:"invalid token"})
    }
}
module.exports = authmiddleware;