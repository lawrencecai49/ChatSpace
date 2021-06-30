/*jshint esversion: 10*/
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardActions, IconButton, Box} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import {deleteComment} from '../api';

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    width: "98%",
    margin: "5px 0px 5px 0px",
    padding: "10px", 
    alignItems: 'center'
  },
  header: {
    display: 'flex',
    alignItems: "center"
  },
  avatar: {
    backgroundColor: red,
    margin: '0px 10px 0px 00px'
  },
  text: {
    justifyItems: "left",
    flexGrow: 1,
    color: red
  },
  authour: {
    margin: "0px 5px 0px 0px"
  },
  comment: {
    textAlign: 'left',
    backgroundColor: red,
  }
}));

export default function Comment(props) {
  const classes = useStyles();

  const handleDelete = () => {
    deleteComment(props.id);
  };

  return (
    <Card className={classes.root}>
      <div className={classes.text}>
        <div className={classes.header}>
          <Box fontWeight="fontWeightBold" fontSize={18} className={classes.authour}>{props.authour} </Box>
          <Box variant="body2" color="textSecondary" fontStyle="italic" fontSize={12}>{props.date}</Box>
        </div>
        <div className={classes.comment}>
          <Box fontSize={16}>{props.content}</Box>
        </div>
      </div>
      <div>
        <CardActions disableSpacing className={classes.icons}>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <Delete />
          </IconButton>
        </CardActions>
      </div>
    </Card>
  );
}