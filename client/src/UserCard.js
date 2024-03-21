import React, { Component } from "react";
import axios from "axios";
import styles from "./main.module.css";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";

class UserCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: "",
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3001/users/photo/${this.props.username}`)
      .then((json) => {
        if (json.data.profilePhoto) {
          this.setState({ avatar: json.data.profilePhoto });
        }
      });
  }

  render() {
    return (
      <Card>
        <CardContent className={styles.userCard}>
          <Grid container>
            <Grid item xs={2}>
              <Avatar
                src={this.state.avatar}
                className={styles.superSmallAvatar}
              />
            </Grid>
            <Grid item xs={10}>
              <Typography>{this.props.username}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default UserCard;
