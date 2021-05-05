/*jshint esversion: 10*/
const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return res.status(401).end("access denied");
  next();
};

//post a new post
router.post('/', isAuthenticated, async(req, res) => {
  try{
    const newPost = new Post({
      authour: req.username,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      permission: req.body.permission
    });
    let savedPost = await newPost.save();
    return res.json(savedPost);
  } catch (err) {
    return res.status(500).end("Error occurred when saving post");
  }
});
  
//delete a post
router.delete('/:postId', isAuthenticated, (req, res) => {
  Post.findByIdAndDelete(req.params.postId, (err, post) => {
    if (err) return res.status(500).end("Error occurred when deleting post");
    if (!post) return res.status(400).end("Could not find post");
    if (post.username != req.username) return res.status(401).end("Access denied: You do not own the post");
    Comment.deleteMany({post: post._id});
    return res.json("Post sucessfully deleted");
  });
});

//get all posts
router.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) return res.status(500).end("Error occured when retrieving posts");
    if(posts === null){
      console.log("undefined");
      return res.json([]);
    } 
    console.log("hi");
    return res.json([]);
  });
});

module.exports = router;