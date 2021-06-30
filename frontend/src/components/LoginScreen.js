/* jshint esversion: 10*/
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Typography, Link, Grid} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';
import {signin} from '../api';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    borderRadius: '15px',
    padding: '10px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  title: {
    position: 'relative',
    width: '100%',
    justify: 'center'
  },
  inputbox: {
    position: 'relative',
    margin: '5px 0px 5px 0px',
    width: 350
  },
  button: {
    position: 'relative',
    color: blue,
    margin: '10px',
    width: '90%'
  }
}));

export default function Login() {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = (e) => {
    if (loggingIn) return;
    setLoggingIn(true);
    e.preventDefault();
    setError("");
    try{
      signin(username, password);
    } catch (err) {
      setError(err);
    }
    setLoggingIn(false);
  };

  return (
    <Grid container className={classes.root} direction="column" justify="flex-start" alignItems="center">
      <Grid item>
        <Typography variant="h6" className={classes.title}>
          Sign In
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {(error !== "") && <Alert severity="error">{error}</Alert>}
      </Grid>
      <Grid item xs={12}>
        <TextField 
          className={classes.inputbox}
          id="username" 
          label="Username" 
          value={username} 
          variant='filled' 
          onChange={e => setUsername(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          className={classes.inputbox}
          id="password" 
          label="Password" 
          type="password" 
          value={password} 
          variant='filled' 
          onChange={e => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        Don't have an account? 
        <Link href="/signup">
          Create one here.
        </Link>
      </Grid>
      <Button 
        className={classes.button} 
        onClick={handleSubmit} 
        variant="contained" 
        color="primary"
      >
        Sign In
      </Button>
    </Grid>
  );
}