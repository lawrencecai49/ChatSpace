/*jshint esversion: 10*/

import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Accordion, AccordionSummary, AccordionDetails, Typography} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function PageAccordion(props) {
  const classes = useStyles();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(async() => {
        axios.get('http://localhost:9000/users/' + props.id, {withCredentials: true}).then(res => {
            console.log(props.id);
            setFollowers(res.data.followers);
            setFollowing(res.data.following);
            console.log(followers);
        }).catch(() => {
            setFollowers([]);
            setFollowing([]);
        });
        }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="following"
        >
          <Typography className={classes.heading}>Following</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(following === []) && 
            <Typography>
                You are not following anyone.
            </Typography>
          }
          {(following !== []) && 
            <Typography>
                You are not following anyone.
            </Typography>
          }
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2a-content"
          id="followers"
        >
          <Typography className={classes.heading}>Followers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(followers !== []) && 
            <Typography>
                No one is following you.
            </Typography>
          }
          {(followers === []) && 
            <Typography>
                You are not following anyone.
            </Typography>
          }
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel3a-content"
          id="messages"
        >
          <Typography className={classes.heading}>Messages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To be implemented
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}