/*jshint esversion: 10*/
const express = require('express');
const router = express.Router();
const User = require('../models/user');

const isAuthenticated = (req, res, next) => {
  if (!req.user || req.user === "") return res.status(401).end("access denied");
  next();
};

//returns followers and following for the current user
router.get('/:user', isAuthenticated, (req, res) => {
  if(req.params,user !== req.user._id) return res.status(401).end("Access denied");
  User.findById(req.params.user, (err, user) => {
    if (err) return res.status(500).send({success: false, message: "Error occurred while retrieving followers"});
    return res.json({followers: user.followers, following: user.following});
  });
});

//returns a list of usernames
router.get('/', (req, res) => {
  let query = {};
  User.find(query, (err, users) => {
    if (err) return res.status(500).send({success: false, message:"Error occurred while retrieving comments"});
    let usernames = [];
    users.map(user => {
        usernames.push(user._id);
    });
    return res.json(usernames);
  }).sort({_id: 1});
});

module.exports = router;