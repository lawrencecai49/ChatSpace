/*jshint esversion: 6 */

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
},
{
    collection: 'Posts'
});

module.exports = mongoose.model('Post', postSchema);