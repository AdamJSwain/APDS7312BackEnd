const express = require('express')
const mongoose = require('mongoose')
const Post = require('./models/post')
const fs = require('fs');
const app = express()
const router = express.Router()
app.use(express.json())
app.use('/api', router)

const cert = fs.readFileSync('keys/Certificate.pem');
const options = {
    server: {sslCA: cert}};

const connstring = 'mongodb+srv://Administrator:Password1@cluster0.iikblv3.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(connstring)
.then(()=>
{console.log('connected :-)')}
)
.catch(()=>
{
    console.log('L bozo, not connected :-(')
},options
);

router.post('/posts',async (req, res) =>
{
    try {
        const {department, content} = req.body
    const post = new Post (
        {
            department,
            content 
        }
    )
    await post.save();
    res.status(201).json({
        message: 'Post created',
        post:post
    })
    } catch (error) {
        res.status(500).json({
            message: 'Stuff is broken yo!'
        })
    }
    
})

router.get('/posts/:postID?',async (req, res) =>
{
    try {
    const {postID} = req.params    
    if(postID){
        const post = await Post.findOne({_id: postID})
        return res.status(200).json({
            message: 'Post gettd',
            post
        })
    }

    const posts = await Post.find({})
    res.status(200).json({
        message: 'Posts gettd',
        posts
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Stuff is broken yo, but for getting!'
        })
    }
    
})



router.delete('/posts/:postID',async (req, res) =>
{
    try {
    const {postID} = req.params
    await Post.deleteOne({_id: postID})
    res.status(200).json({
        message: 'Posts relocated to Ocean View'
        
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Stuff is broken yo, but for deleting!'
        })
    }
    
})

module.exports = app;