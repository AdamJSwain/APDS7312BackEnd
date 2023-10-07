const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register',async (req, res) =>
{
    try {
        const {username, email, name, surname, password} = req.body
        const hash = await bcrypt.hash(password, 10)
    const user = new User (
        {
            username,
            email,
            name,
            surname,
            password: hash
        }
    )
    const createdUser = await user.save();
    const token = createAuthToken(createdUser._id)
    res.status(201).json({
        message: 'user created',
        token
        
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Stuff is broken yo! but for registration'
        })
    }
    
})

router.post('/login',async (req, res) =>
{
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user){
            throw new Error('Try registering next time, its free')
        }
        const valid = await bcrypt.compare(password, user.password)
        if(!valid){
            throw new Error('wrong password')
        }
        const token = createAuthToken(user._id)
    res.status(201).json({
        message: 'logged in',
        token
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Stuff is broken yo! but for login'
        })
    } 
})

function createAuthToken(userID)
{
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn:"1 day"})
    return token
}

module.exports = router
