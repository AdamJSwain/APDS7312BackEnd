const express = require('express');
const router = express.Router();
const Post = require('../models/post')

router.post('/',async (req, res) =>
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
        console.error(error)
        res.status(500).json({
            message: 'Stuff is broken yo!'
        })
    }
    
})

router.get('/:postID?',async (req, res) =>
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



router.delete('/:postID',async (req, res) =>
{
    try {
    const {postID} = req.params
    await Post.deleteOne({_id: postID})
    res.status(200).json({
        message: 'Post deleted'
        
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Stuff is broken yo, but for deleting!'
        })
    }
    
})

module.exports = router