import React, { Component } from "react";
import axios from "axios";
import styles from "./main.module.css";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";

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
