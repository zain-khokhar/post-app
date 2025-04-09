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
/* 
const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;

const authmiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } 
    try {
        const decoded = jwt.verify(token.split(' ')[1], secretkey); // Bearer <token> format ke liye split
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authmiddleware;
*/