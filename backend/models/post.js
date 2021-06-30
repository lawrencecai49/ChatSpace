/*jshint esversion: 6 */

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authour: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
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