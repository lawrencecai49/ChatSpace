/*jshint esversion: 10*/

const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookie = require('cookie');
const validator = require('validator');
const User = require('./models/user');
const crypto = require('crypto');
require('dotenv/config');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 60 * 24 * 7}
}));

app.use(function(req, res, next){
  let username = (req.user)? req.user._id : '';
  res.setHeader('Set-Cookie', cookie.serialize('username', username, {
    path : '/', 
    maxAge: 60 * 60 * 24 * 7
  }));
  next();
});

if (app.get('env') === 'production') {
  session.cookie.secure = true;
}

app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}));

//api paths
const getHash = (password, salt) => {
  try{
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
  } catch(err){
    return null;
  }
};

const isNotAuthenticated = (req, res, next) => {
  if (req.user && req.user != "") return res.status(401).end({success: false, message: "Access denied: Authenticated user"});
  next();
};

const isAuthenticated = (req, res, next) => {
  if (!req.user || req.user === "") return res.status(401).end("access denied");
  next();
};

const checkSignInInfo = (req, res, next) => {
  if (!validator.isAlphanumeric(req.body.username)) return res.status(422).send({success: false, message: "bad input: username must be alphanumeric"});
  if (validator.isEmpty(req.body.username)) return res.status(423).send({success: false, message:"bad input: username must be non-empty"});
  if (validator.isEmpty(req.body.password)) return res.status(424).send({success: false, message:"bad input: password must be non-empty"});
  User.findOne({_id: username}, (err, user) => {
    if (err) return res.status(500).send({success: false, message: err.toString()});
    if (user) return res.status(409).send({success: false, message:username + " is already taken"});
  });
  next();
};

//sign up
app.post('/signup', isAuthenticated, checkSignInInfo,  async(req, res) => {
  const username = req.body.username;
  var salt = crypto.randomBytes(16).toString('base64');
  var hashword = getHash(req.body.password, salt);
  if (!hashword) return res.status(500).send("Failed to hash password");
  const newUser = new User({
    _id: username,
    password: hashword,
    salt: salt,
    followers: [],
    following: []
  });
  try{
    let savedUser = await newUser.save();
    res.json("Successfully registered " + savedUser._id);
  } catch(err) {
    return res.status(500).end("Error occurred when saving user info");
  }
});

//signin
app.post('/signin', isAuthenticated ,checkSignInInfo, (req, res) => {
  User.findById(req.body.username, (err, user) => {
    if (err) return res.status(500).send({success: false, message: "Server side error"});
    if (!user) return res.status(404).send({success: false, message: "User not found"});
    
    res.setHeader('Set-Cookie', cookie.serialize('username', req.user._id, {
      path : '/', 
      maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    return res.json({success: true});
  });
});

//signout
app.get('/signout', isNotAuthenticated, (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('username', '', {
    path : '/', 
    maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
  }));
  res.json("Successfully signed out");
});

const commentsRouter = require('./routes/comments');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

//connect to mongodb 
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true}, () => {
  console.log("connected to DB");
});

//https setup
const PORT = 9000;
app.listen(PORT, () => {
  console.log("Connected to port: ", PORT);
});

module.exports = app;