const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs');
const app = express()
const router = express.Router()
const postRoutes = require('./routes/post')
const userRoutes = require('./routes/user')
const authMW = require('./middleware/auth')
require('dotenv').config()
app.use(express.json())

const cert = fs.readFileSync('keys/Certificate.pem');
const options = {
    server: {sslCA: cert}};

const connstring = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`
mongoose.connect(connstring)
.then(()=>
{console.log('connected :-)')}
)
.catch(()=>
{
    console.log('L bozo, not connected :-(')
},options
);
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers':
            'Origin, X-Requested-Width, Content-Type, Accept, x-access-token, x-refresh-token, x-refresh-token-id, Authorization',
        'Access-Control-Expose-Headers':
            'x-access-token, x-refresh-token, x-refresh-token-id',
        'Content-Security-Policy': "script-src 'self'"
    });
    next();
});
app.use('/api/posts',authMW, postRoutes)
app.use('/api/users', userRoutes)
module.exports = app;