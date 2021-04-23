/*jshint esversion: 6 */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
},
{
    collection: 'Comments'
});

module.exports = mongoose.model('Comment', commentSchema);