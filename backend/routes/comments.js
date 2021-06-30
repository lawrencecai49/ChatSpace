/*jshint esversion: 10*/
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');

const isAuthenticated = (req, res, next) => {
  if (!req.user || req.user === "") return res.status(401).end("access denied");
  next();
};

//post a comment
router.post('/', isAuthenticated, async(req, res) => {
  Post.findById(req.body.postId, async(err, post) => {
    if(err) return res.status(500).send({success: false, message: "Server side error while saving comment"});
    if(!post) return res.status(401).end({success: false, message: "post does not exist"});
    const newComment = new Comment({
      authour: req.user._id,
      post: req.body.postId,
      content: req.body.content
    });
    try{
      let savedComment = await newComment.save();
      return res.json(savedComment);
    } catch (error) {
      return res.status(500).end("Error occurred when saving comment");
    }
  });
});

//delete a comment
router.delete('/:commentId', isAuthenticated, (req, res) => {
  Comment.findById(req.params.commentId, (err, comment) => {
    if (err) return res.status(500).end({success: false, message: "Server side error occurred while deleting comment"});
    if(!comment) return res.status(400).end({success: false, message: "Could not find comment to delete"});
    if (comment.authour != req.user._id) return res.status(401).end({success: false, message:"Access denied: Comments can only be deleted by user who posted it"});
    Comment.findByIdAndDelete(comment._id, (err, deletedComment) => {
      if (err) return res.status(500).end({success: false, message: "Error occurred while deleting comment"});
      return res.json({success: true, message:"Comment successfully deleted"});
    });
  });
});

//get comments
router.get('/', isAuthenticated, (req, res) => {
  let query = {};
  if (req.query.postId) query.post = req.query.postId;
  Comment.find(query, (err, comments) => {
    if (err) return res.status(500).end({success: false, message: "Error occurred while retrieving comments"});
    return res.json(comments);
  }).sort({date: -1}).limit(10);
});

module.exports = router;