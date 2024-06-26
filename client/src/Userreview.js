import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { createMuiTheme } from "@mui/material/styles";
import styles from "./main.module.css";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Link } from "@mui/material";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

class forumComment extends Component {
  constructor(props) {
    super(props);
    this.convertTime = this.convertTime.bind(this);

    this.state = {
      avatar: "",
    };
  }

  convertTime(time) {
    var d = new Date(time);
    const month = monthNames[d.getMonth()];
    const today = new Date();
    var localTime = d.toLocaleString("en-US", {
      timeZone: this.props.timeZone,
    });
    localTime = new Date(localTime);
    var day = localTime.getHours() >= 12 ? "PM" : "AM";
    var hour = (localTime.getHours() + 24) % 12 || 12;
    var min = localTime.getMinutes();
    min = min < 10 ? `0${min}` : min;
    if (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() &&
      today.getFullYear()
    ) {
      if (d.getDate() === today.getDate()) {
        return `Today, ${hour}:${min} ${day}`;
      } else if (d.getDate() === today.getDate() - 1) {
        return `Yesterday, ${hour}:${min} ${day}`;
      }
    }
    return `${month} ${d.getDate()}, ${d.getFullYear()}`;
  }

  // Really inefficient way to deal with updated user avatars because a call is made for every review on the page
  // A better way is when a user updates user photo, update every review by this user with the new avatar url
  // For now, we will keep avatar props for future implementation
  componentDidMount() {
    // Update avatar
    axios
      .get(`http://localhost:3001/users/photo/${this.props.author}`)
      .then((json) => {
        if (json.data.profilePhoto) {
          this.setState({ avatar: json.data.profilePhoto });
        }
      });
  }

  render() {
    const theme = createMuiTheme({
      "@global": {
        body: {
          backgroundColor: "white",
        },
      },
    });

    const paperStyle = {
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };

    const avatarStyle = {
      margin: 1,
      backgroundColor: "gray",
    };

    const formStyle = {
      width: "100%", // Fix IE 11 issue.
      marginTop: 3,
    };

    var thumbsIcon =
      this.props.rep === "+" ? (
        <ThumbUpIcon className={styles.thumbsUp}></ThumbUpIcon>
      ) : (
        <ThumbDownIcon className={styles.thumbsDown}></ThumbDownIcon>
      );

    var timestamp = this.convertTime(this.props.timestamp);

    return (
      <Grid container spacing={8}>
        <Grid item></Grid>
        <Grid item xs={11}>
          <Grid container spacing={8}>
            <Grid item xs={1}>
              <Avatar src={this.state.avatar} className={styles.smallSize} />
            </Grid>
            <Grid item xs={10}>
              <Typography
                className={styles.userNameComment}
                href="google.com"
                display="inline"
              >
                <Link href={`/profile/${this.props.author}`}>
                  {this.props.author}
                </Link>
              </Typography>
              <Typography className={styles.timeStamp} display="inline">
                {timestamp}
              </Typography>
              {thumbsIcon}
              <Typography variant="body1" className={styles.commentBody}>
                {this.props.comment}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default forumComment;
