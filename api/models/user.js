/*jshint esversion: 6 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    friends: {
        type: Array,
        required: true
    },
},
{
    collection: 'Users'
});

module.exports = mongoose.model('User', userSchema);