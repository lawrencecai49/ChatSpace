/* jshint esversion: 10*/
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Post from './Post';
import TaskBar from './TaskBar';
import {getPosts, isAuthenticated} from '../api';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: '100vw',
    minHeight: '100vh'
  }
}));

export default function UserPage({match}) {
  const classes = useStyles();
  
  const [auth, setAuth] = useState(false);
  const [userPosts, setPosts] = useState([]);
  const [user, setUser] = useState("");

  //every 2 seconds check if user is logged in and retrieve posts
  useEffect(() => {
    const interval = setInterval(async() => {
      const user = isAuthenticated();
      setAuth(user !== "");
      setUser(user);
      axios.get('http://localhost:9000/posts/' + match.params.user, {withCredentials: true}).then(res => {
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
      {userPosts.map(post => {
        return <Post key={post._id} id={post._id} auth={auth} authour={post.authour} date={post.date} description={post.description} imageUrl={post.imageUrl}/>
      })}
    </div>
  );
}