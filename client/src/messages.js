/* eslint-disable no-use-before-define */
import React, { Component } from "react";
import Button from "@mui/material/Button";
//import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import TopMenu from "./TopMenu";
import axios from "axios";
import { createMuiTheme } from "@mui/material/styles";
import mainStyles from "./main.module.css";
import MessageBox from "./messageInbox";

class editForumPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      threads: [],
      avatar: "",
      currentUser: "",
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3001/user/currentuser", { withCredentials: true })
      .then((userJson) => {
        if (userJson.data.username === "Guest") {
          alert("Please sign in first");
          return;
        }
        // Retrieve user's inbox
        axios
          .get(`http://localhost:3001/messageThread/${userJson.data.username}`)
          .then((json) => {
            if (!json.data) {
              console.log("Error retrieving inbox");
            } else {
              const threads = json.data;
              this.setState({
                threads: threads,
                avatar: userJson.data.profilePhoto,
                currentUser: userJson.data.username,
              });
            }
          });
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

    const submitStyle = {
      marginTop: 3,
      marginBottom: 0,
      marginRight: 2,
    };

    const tileStyle = {};

    const gridStyle = {
      marginTop: 20,
    };

    const titleStyle = {
      marginTop: 20,
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

    const dividerGridStyle = {
      root: {
        width: "fit-content",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        "& svg": {
          margin: useTheme().spacing(1.5),
        },
        "& hr": {
          margin: useTheme().spacing(0, 0.5),
        },
      },
    };

    return (
      <div>
        <TopMenu history={this.props.history}></TopMenu>
        <div className="content">
          <Grid container spacing={3} style={{ marginBottom: 20 }}>
            <Grid item xs={6}>
              <Typography
                style={titleStyle}
                align="Left"
                variant="h4"
                component="h2"
              >
                Messages
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={() => this.props.history.push("/createmessage")}
                color="secondary"
                className={mainStyles.composeMessage}
                variant="contained"
              >
                Compose
              </Button>
            </Grid>
          </Grid>

          <MessageBox
            avatar={this.state.avatar}
            threads={this.state.threads}
            currentUser={this.state.currentUser}
          ></MessageBox>
        </div>
      </div>
    );
  }
}

export default editForumPost;
