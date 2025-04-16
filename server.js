const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectdb = require('./config/db');
const authroutes = require('./routes/auth'); 
const bodyparser = require('body-parser');
const port = 4001;
// middleware
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
// connect to db 
connectdb();
// routes 
app.use('/api/auth',authroutes);
app.use('/api/createpost',require('./routes/auth'));
app.use('/api/readpost', require('./routes/auth'));
app.use('/api/deletepost', require('./routes/auth'));
app.use('/api/updatepost', require('./routes/auth'));
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
