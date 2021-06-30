/* jshint esversion: 10*/
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Typography, Link, Grid} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {signup} from '../api';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root:{
    justifyContent: 'center',
    display: 'flex',
    height: '100vh',
    width: '100vw'
  },
  signInBox: {
    position: 'relative',
    borderStyle: "solid",
    margin: 'auto',
    width: '74vw',
    height:'74vh',
    backgroundColor: "white",
    borderRadius: '10px',
    padding: "35px 15px 15px 15px",
  },
  button: {
    position: 'relative',
    color: blue,
    margin: '10px',
    width: '90%'
  },
  inputText: {
    position: 'relative',
    margin: '5px',
    width: '90%'
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [registeringUser, setRegisteringUser] = useState(false);
  
  const handleSubmit = (e) => {
    if(registeringUser){
      return;
    }
    e.preventDefault();
    setRegisteringUser(true);
    setError("");
    if(password !== Cpassword){
      return setError("Password must match");
    }
    try{
      signup(username, password);
    } catch(err) {
      setError(err);
    }
    setRegisteringUser(false);
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.signInBox} justify='space-between' direction='column' alignItems='center'>
        <Grid container justify='center' direction='column'>
          <Typography variant="h3">
            Sign Up
          </Typography>
          {(error !== "") && <Alert severity="error">{error}</Alert>}
          <div>
            <TextField 
              required 
              className={classes.inputText}
              id="username" 
              label="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <TextField 
              className={classes.inputText}
              required 
              id="password" 
              label="Password" 
              value={password} 
              type='password'
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <TextField 
              required 
              className={classes.inputText}
              error={password !== Cpassword} 
              id="confirm password" 
              label="Confirm Password" 
              type='password'
              value={Cpassword} 
              onChange={e => setCPassword(e.target.value)}
            />
          </div>
          <div>
            <Button 
              className={classes.button} 
              onClick={handleSubmit} 
              variant='contained' 
              color='primary'
            >
              Register
            </Button>
          </div>
        </Grid>
        <Grid item>
          <Link href="/" underline='hover'>
            Go back
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}