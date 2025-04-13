const mongoose = require('mongoose');
const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to db')
    } catch (error) {
        console.log('error connecting to db',error)
    }
}
module.exports = connectdb;
