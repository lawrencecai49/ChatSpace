/*jshint esversion: 10*/
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, IconButton, Button, MenuItem, Menu, Modal, Avatar, Badge, Link} from '@material-ui/core';
import {Notifications} from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import {signout} from '../api';
import Login from './LoginScreen';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  },
  modal: {
    justifyContent: "center",
    justifyItems: "center"
  },
  avatar: {
    backgroundColor: red[500]
  },
}));

export default function TaskBar(props) {
  const classes = useStyles();
  const [openModal, setModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => {
    setModal(true);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  const handleSignOut = () => {
    signout();
  };
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title} align='left'>
            Farcebook
          </Typography>
          {(props.auth) && (
            <div>
              <IconButton aria-label="notifications" color="inherit">
                <Badge badgeContent={11} color="secondary">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {props.authour.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSignOut}>Signout</MenuItem>
                <Link to={"/pages/" + props.authour}>
                  <MenuItem>
                    My Page
                  </MenuItem>
                </Link>
              </Menu>
            </div>
          )}
          {(!props.auth) && (
            <div>
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleModalOpen}
                color="inherit"
              >
                  Login
              </Button>
              <Modal
                className={classes.modal}
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <Login />
              </Modal>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}