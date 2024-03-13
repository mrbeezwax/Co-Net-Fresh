import React from "react";
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import Review from "./Userreview";

export default function ReviewTab(props) {
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

  var reviewList = [];
  var key = 1;
  props.allRep.forEach((review) => {
    const rep = review.rep;
    const author = review.username;
    const comment = review.comment;
    const avatar = review.avatar;
    const timestamp = review.timestamp;
    // console.log(rep);
    // console.log(author);
    // console.log(comment);

    reviewList.unshift(
      <Review
        key={key++}
        author={author}
        rep={rep}
        comment={comment}
        avatar={avatar}
        timestamp={timestamp}
        timeZone={props.timeZone}
      ></Review>
    );
    // setReviews(reviews);
  });

  return (
    <div className="content">
      <Grid container spacing={3}>
        <Typography style={titleStyle} align="Left" variant="h6" component="h2">
          {props.title}
        </Typography>
      </Grid>
      {/* List All Reviews */}
      {reviewList}
    </div>
  );
}
