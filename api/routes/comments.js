/*jshint esversion: 10*/
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return res.status(401).end("access denied");
  next();
};

//post a comment
router.post('/', isAuthenticated, async(req, res) => {
  const newComment = new Comment({
    authour: req.username,
    post: req.body.post,
    content: req.body.content
  });
  try{
    let savedComment = await newComment.save();
    return res.json(savedComment);
  } catch (err) {
    return res.status(500).end("Error occurred when saving comment");
  }
});

//delete a comment
router.delete('/:commentId', isAuthenticated, (req, res) => {
  Comment.findById(req.params.commentId, (err, comment) => {
    if (err) return res.status(500).end("Error occurred while deleting comment");
    if(!comment) return res.status(400).end("Could not find comment to delete");
    if (comment.username != req.user._id) return res.status(401).end("Access denied: Comments can only be deleted by user who posted it");
  });

  Comment.findByIdAndDelete(req.params.commentId, (err, comment) => {
    if (err) return res.status(500).end("Error occurred while deleting comment");
    if(!comment) return res.status(400).end("Could not find comment to delete");
    if (comment.username != req.username) return res.status(401).end("Access denied: Comments can only be deleted by user who posted it");
    return res.json("Comment successfully deleted");
  });
});

//get all comments associated with a post
router.get('/:postId', isAuthenticated, (req, res) => {
  Comment.find({post: req.params.postId}, (err, comments) => {
    if (err) return res.status(500).end("Error occurred while retrieving comments");
    return res.json(comments);
  });
});

module.exports = router;