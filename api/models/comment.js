/*jshint esversion: 6 */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    authour: {
        type: String,
        required: true
    },
    post:{
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false,
        default: Date.now()
    }
},
{
    collection: 'Comments'
});

module.exports = mongoose.model('Comment', commentSchema);