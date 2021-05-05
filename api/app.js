/*jshint esversion: 10*/

const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer  = require('multer');
const cookie = require('cookie');
const passport = require('passport');
const validator = require('validator');
const User = require('./models/user');
const crypto = require('crypto');
require('dotenv/config');

const initializePassport = require('./passport-config');
initializePassport(
  passport, 
  username => User.findById(username, (err, user) => {return user;})
);

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

app.use((req, res, next) => {
  let username = (req.session.user)? req.session.user._id : '';
  console.log("Username: ", username);
  res.setHeader('Set-Cookie', cookie.serialize('username', username, {
    path : '/', 
    maxAge: 60 * 60 * 24 * 7
  }));
  next();
});

if (app.get('env') === 'production') {
  session.cookie.secure = true;
}

app.use(passport.initialize());
app.use(passport.session());

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
  if (!req.isAuthenticated()) return res.status(401).end("access denied");
  next();
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return res.status(401).end("access denied");
  next();
};

const checkSignInInfo = (req, res, next) => {
  if (!validator.isAlphanumeric(req.body.username)) return res.status(422).send("bad input: username must be alphanumeric");
  if (validator.isEmpty(req.body.username)) return res.status(423).send("bad input: username must be non-empty");
  if (validator.isEmpty(req.body.password)) return res.status(424).send("bad input: password must be non-empty");
  next();
};

//sign up
app.post('/signup', isAuthenticated, checkSignInInfo,  async(req, res) => {
  const username = req.body.username;
  User.findOne({_id: username}, (err, user) => {
    if (err) return res.status(500).send("500");
    if (user) return res.status(409).send(username + " is already taken");
  });
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
app.post('/signin', checkSignInInfo, passport.authenticate('local'), (req, res) => {
  console.log("In sign in: " , req.isAuthenticated(), " User is:", req.user._id);
  return res.json(true);
});

//signout
app.get('/signout', isNotAuthenticated, (req, res) => {
  req.logout();
  res.json("Successfully signed out");
});

const commentsRouter = require('./routes/comments');
const postsRouter = require('./routes/posts');
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);

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