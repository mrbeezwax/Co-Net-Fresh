import React from "react";
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import Friend from "./friend";

export default function friendList(props) {
  const titleStyle = {
    marginBottom: 30,
    color: "#535353",
  };

  const gameTitle = {
    color: "black",
    marginTop: 20,
    marginLeft: 8,
  };
  const gameDesc = {
    color: "#535353",
    marginTop: 5,
    marginLeft: 8,
  };

  var followList = [];
  props.allFollowers.forEach((following) => {
    const username = following.username;
    followList.unshift(<Friend username={username}></Friend>);
  });

  return (
    <div className="content">
      <Grid container spacing={3}>
        <Typography style={titleStyle} align="Left" variant="h6" component="h2">
          {props.title}
        </Typography>
      </Grid>
      {followList}
    </div>
  );
}
