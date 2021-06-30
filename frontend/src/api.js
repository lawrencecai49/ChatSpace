/* jshint esversion:10 */

import axios from "axios";

export const signin = (username, password) => {
    const user = {
        username: username,
        password: password
    };
    axios.post('http://localhost:9000/signin', user, {withCredentials: true}).then(res => {
        console.log("Success" ,res);
        window.location = "/";
    }).catch(err => {
        console.log("Error in signin", err);
        throw err;
    });
};

export const signup = (username, password) => {
    const user = {
        username: username,
        password: password
    };
    axios.post('http://localhost:9000/signup', user, {withCredentials: true}).then(() => {
        window.location = "/";
    }).catch(err => {
        throw err;
    });
};

export const signout = () => {
    axios.get('http://localhost:9000/signout', {withCredentials: true}).then(res => {
    }).catch(err => {
        throw err;
    });
};

export const addPost = (description, url) => {
    const newPost = {
        imageUrl: url,
        description: description,
        public: true,
    };
    axios.post('http://localhost:9000/posts/', newPost, {withCredentials: true}).then(res => {
        return;
    }).catch(err => {
        throw err;
    });
};

export const deletePost = (postId) => {
    axios.delete('http://localhost:9000/posts/' + postId, {withCredentials: true});
};

export const getPosts = () => {
    axios.get('http://localhost:9000/posts/', {withCredentials: true}).then(res => {
        console.log(res.data);
        return res.data;
    }).catch((err) => {
        return [];
    });
};

export const isAuthenticated = () => {
    var username = document.cookie.split("username=")[1];
    if (username.length === 0) return "";
    return username;
};

export const addComment = (content, postId) => {
    const newComment = {
        content: content,
        postId: postId
    };
    axios.post('http://localhost:9000/comments/', newComment, {withCredentials: true}).then(() => {
        console.log("Comment succssfully posted");
    }).catch(err => {
        console.log(err);
    });
};

export const deleteComment = (commentId) => {
    axios.delete('http://localhost:9000/comments/' + commentId, {withCredentials: true}).then(res => {
        return res;
    }).catch(err => {
        throw err;
    });
};

export const getPostComments = (postId) => {
    axios.get('http://localhost:9000/comments/' + postId, {withCredentials: true}).then(res => {
        return res;
    }).catch(err => {
        throw err;
    });
};