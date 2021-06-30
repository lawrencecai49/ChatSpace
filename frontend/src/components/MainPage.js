/* jshint esversion: 10*/
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Post from './Post';
import PostForm from './PostForm';
import TaskBar from './TaskBar';
import Accordion from './Accordion';
import {Box} from '@material-ui/core';
import {getPosts, isAuthenticated} from '../api';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: '100vw',
    minHeight: '100vh'
  },
  body: {
    display: 'flex',
    flexDirection: 'row'
  },
  posts: {
    width: '70vw'
  },
  accordion: {
    width: '30vw'
  }
}));

export default function MainPage() {
  const classes = useStyles();
  
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState(true);
  const [user, setUser] = useState("");

  //every 2 seconds check if user is logged in and retrieve posts
  useEffect(() => {
    const interval = setInterval(async() => {
      const user = isAuthenticated();
      setAuth(user !== "");
      setUser(user);
      axios.get('http://localhost:9000/posts/', {withCredentials: true}).then(res => {
        setPosts(res.data);
      }).catch(() => {
        setPosts([]);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.root}>
      <TaskBar auth={auth} authour={user}/>
      {auth && (<PostForm/>)}
      <div className={classes.box}>
        <div className={classes.posts}>
          {posts.map(post => {
            return <Post key={post._id} id={post._id} auth={auth} authour={post.authour} date={post.date} description={post.description} imageUrl={post.imageUrl}/>
          })}
        </div>
        <div className={classes.accordion}>
          {auth && (<Accordion id={user}/>)}
        </div>
      </div>
    </div>
  );
}