/*jshint esversion: 6 */

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    picture: {
        type: String,
        required: true
    },
},
{
    collection: 'Posts'
});

module.exports = mongoose.model('Post', postSchema);