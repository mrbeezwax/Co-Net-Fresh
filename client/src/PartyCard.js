import React, { Component } from "react";
import axios from "axios";
import styles from "./main.module.css";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import JoinParty from "./JoinParty";
import { Link } from "@mui/material";

class PartyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: "",
      isInParty: false,
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3001/users/photo/${this.props.leader}`)
      .then((json) => {
        if (json.data.profilePhoto) {
          this.setState({ avatar: json.data.profilePhoto });
        }
      });
    if (this.props.leader === this.props.currentUser)
      this.setState({ isInParty: true });
    else if (
      this.props.party.partyMembers.filter(
        (member) => member.username === this.props.currentUser
      ).length != 0
    ) {
      this.setState({ isInParty: true });
    }
  }

  render() {
    return (
      <Card
        style={{ marginBottom: 20, padding: 5 }}
        raised="true"
        variant="outlined"
      >
        <CardContent className={styles.userCard}>
          <Grid container>
            <Grid item xs={1}>
              <Avatar src={this.state.avatar} />
            </Grid>
            <Grid item xs={10}>
              <Typography className={styles.userNameGame}>
                <Link href={`/profile/${this.props.leader}`}>
                  {this.props.leader}
                </Link>
              </Typography>
              <JoinParty
                inParty={this.state.isInParty}
                inOtherParty={this.props.inOtherParty}
                currentUser={this.props.currentUser}
                leaderAvatar={this.state.avatar}
                gameID={this.props.gameID}
                game={this.props.game}
                party={this.props.party}
              ></JoinParty>
              <Typography>Max Players: {this.props.maxPlayers}</Typography>
              <Typography>
                Current Players: {this.props.currentPlayers}{" "}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default PartyCard;
