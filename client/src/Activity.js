import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ActivityLine from "./ActivityLine";

export default function friendList(props) {
  const titleStyle = {
    marginBottom: 30,
    color: "#535353",
  };

  var activityList = [];
  props.allActivity.forEach((activity) => {
    const postID = activity.postID;
    activityList.unshift(<ActivityLine postID={postID}></ActivityLine>);
  });
  return (
    <div className="content">
      <Grid container spacing={3}>
        <Typography style={titleStyle} align="Left" variant="h6" component="h2">
          {props.title}
        </Typography>
      </Grid>
      {activityList}
    </div>
  );
}
