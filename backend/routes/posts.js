/*jshint esversion: 10*/
const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const { query } = require('express');

const isAuthenticated = (req, res, next) => {
  if (!req.user || req.user === "") return res.status(401).end("access denied");
  next();
};

//post a new post
router.post('/', isAuthenticated, async(req, res) => {
  try{
    const newPost = new Post({
      authour: req.user._id,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      public: req.body.public
    });
    let savedPost = await newPost.save();
    return res.json(savedPost);
  } catch (err) {
    console.log(err);
    return res.status(500).end("Error occurred when saving post");
  }
});
  
//delete a post
router.delete('/:postId', isAuthenticated, (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) return res.status(500).end("Error occurred while deleting post");
    if(!post) return res.status(400).end("Could not find comment to delete");
    if (post.authour !== req.user._id) return res.status(401).end("Access denied: Posts can only be deleted by user who posted it");
    Post.findByIdAndDelete(post._id, (err, deletedPost) => {
      if (err) return res.status(500).end("Error occurred when deleting post");
      Comment.deleteMany({post: deletedPost._id});
      return res.json("Post sucessfully deleted");
    });
  });
});

//get all posts
router.get('/', (req, res) => {
  let query = {};
  if (req.query.userId) query.author= req.query.userId;
  Post.find(query, (err, posts) => {
    if (err) return res.status(500).send({success: false, message: "Error occured when retrieving posts"});
    return res.json(posts);
  }).sort({date: -1}).limit(10);
});

module.exports = router;