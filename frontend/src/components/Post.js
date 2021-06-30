/*jshint esversion: 10*/
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, Typography, IconButton, TextField} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {InsertComment, ThumbUp, Delete} from '@material-ui/icons';
import Comment from './Comment';
import axios from 'axios';
import {deletePost, getPostComments, addComment} from '../api';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    width: '100%',
    margin: "15px 15px 15px 15px",
  },
  header: {
    justify: "left"
  },
  media: {
    width: '100%',
  },
  avatar: {
    backgroundColor: red[500],
  },
  icons: {
    display: 'flex',
    justifyContent : 'space-around',
    color: "blue"
  },
  commentForm: {
    position: "relative",
    width: "100%"
  }
}));

export default function Post(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [deletable, setDeletable] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if(props.auth){
      const interval = setInterval(async() => {
        axios.get('http://localhost:9000/comments/' + props.id, {withCredentials: true}).then(res => {
          setComments(res.data);
        }).catch(() => {
          setComments([]);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleAddComment = (e) => {
    if(e.key === 'Enter' && comment !== ""){
      addComment(comment, props.id);
      setComment("");
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    if(!deletable) return;
    setDeletable(false);
    deletePost(props.id);
    setDeletable(true);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {props.authour.charAt(0)}
          </Avatar>
        }
        title={props.authour}
        subheader={props.date}
      />
      <CardMedia
        className={classes.media}
        component="img"
        image={props.imageUrl}
        title="Picture"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.description}
        </Typography>
      </CardContent>
      {props.auth && (<CardActions disableSpacing className={classes.icons}>
        <IconButton aria-label="like">
          <ThumbUp color="primary"/>
        </IconButton>
        <IconButton 
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="comments"
        >
          <InsertComment />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDelete}>
          <Delete />
        </IconButton>
      </CardActions>)}
      {props.auth && (<Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <TextField 
            className={classes.commentForm} 
            onKeyPress={handleAddComment} 
            id="comment" 
            onChange={e => setComment(e.target.value)}
            value={comment}
            label="Write a comment" 
            variant="filled"
          />
          {comments.map(comment => {
            return <Comment key={comment._id} id={comment._id} authour={comment.authour} content={comment.content} date={comment.date}/>
          })}
        </CardContent>
      </Collapse>)}
    </Card>
  );
}