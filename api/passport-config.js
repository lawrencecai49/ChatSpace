/*jshint esversion: 10*/

const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const User = require('./models/user');
  
const getHash = (password, salt) => {
    try{
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('base64');
    } catch(err){
        return null;
    }
};

const initialize = (passport) => {
    const authenticateUser = async (username, password, done) => {
        User.findById(username, (err, user) => {
            if(!user){
                return done(err, false, 'Incorrect username');
            }
            try{
                let hashedword = getHash(password, user.salt);
                if(hashedword === user.password){
                    return done(err, user);
                } else {
                    return done(err, false, 'Incorrect password');
                }
            } catch(error) {
                return done(error);
            }
        });
    };
    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

module.exports = initialize;