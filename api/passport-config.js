/*jshint esversion: 10*/

const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
  
const getHash = (password, salt) => {
    try{
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('base64');
    } catch(err){
        return null;
    }
};

const initialize = (passport, getUser) => {
    const authenticateUser = async (username, password, done) => {
        const user = await getUser(username);
        if(!user){
            return done(null, false, 'Incorrect username');
        }
        try{
            let hashedword = getHash(password, user.salt);
            if(hashedword === user.password){
                return done(null, user);
            } else {
                return done(null, false, 'Incorrect password');
            }
        } catch(err) {
            return done(err);
        }
    };
    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => done(null, getUser(id)));
};

module.exports = initialize;