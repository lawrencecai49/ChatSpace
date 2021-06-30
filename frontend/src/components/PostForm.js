/* jshint esversion: 10*/
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Radio} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {addPost} from '../api';

const useStyles = makeStyles(() => ({
  root: {
    borderStyle: "solid",
    margin: "15px",
    width: '70vw',
    backgroundColor: "white",
    borderRadius: '10px'
  },
  title: {
    backgroundColor: "blue",
    color: "white",
    fontSize: "25px",
    borderRadius: '5px 5px 0px 0px',
    padding: '15px'
  },
  description: {
    position: "relative",
    width: "90%",
    margin: "5px 0px 5px 0px"
  },
  switch: {
    display: 'flex',
    position: 'relative',
    width: '90%',
  },
  button: {
    position: 'relative',
    width: '90%',
    margin: "10px 0px 10px 0px"
  }
}));

export default function PostForm() {
  const classes = useStyles();
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [submitingPost, setSubmittingPost] = useState(false);
  
  const handleSubmit = (e) => {
    if(submitingPost) return;
    setError("");
    e.preventDefault();
    if(description === ''){
      setError("Description must be non-empty");
      return;
    }
    setSubmittingPost(true);
    try{
      addPost(description, url);
      setDescription("");
      setUrl("");
    } catch (err) {
      setError(err);
    }
    setSubmittingPost(false);
    return;
  };

  return (
    <form className={classes.root}>
      <div className={classes.title}> Post Image </div>
      <div>
        {(error !== "") && <Alert severity="error">{error}</Alert>}
      </div>
      <div>
        <TextField 
          className={classes.description}
          id="Description" 
          label="Description" 
          multiline 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rowmax={4}
        />
      </div>
      <div>
        <TextField 
          className={classes.description}
          id="Url" 
          label="Url" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
        />
      </div>
      <Button className={classes.button} onClick={handleSubmit} variant='contained' color='primary'>Post</Button>
    </form>
  );
}