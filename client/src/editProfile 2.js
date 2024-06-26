import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import TopMenu from "./TopMenu";
import { createMuiTheme } from "@mui/material/styles";
import styles from "./main.module.css";
import profilePic from "./profilePic.png";
import Typography from "@mui/material/Typography";
import Menu from "./ProfileMenu.js";
import Button from "@mui/material/Button";

class editProfile extends Component {
  constructor(props) {
    super(props);
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

    return (
      <div>
        <TopMenu history={this.props.history}></TopMenu>
        <div className={styles.bgColor}>
          <div className={styles.profilePhoto}> </div>

          <Avatar src={profilePic} className={styles.large} />
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={styles.editProfile}
          >
            Edit Profile
          </Button>
        </div>
        <div className={styles.bgColor}>
          <Typography
            className={styles.profileText}
            variant="h5"
            style={{ paddingTop: 20 }}
            align="center"
          >
            Destroyer392
          </Typography>
          <Typography
            className={styles.profileBio}
            variant="body1"
            style={{ paddingTop: 20 }}
            align="center"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
            rhoncus nunc, eget tempor purus. Praesent sollicitudin, ligula id
            porttitor faucibus, tortor mauris hendrerit augue, ut molestie ipsum
            arcu Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            eget rhoncus nunc, eget tempor purus. Praesent sollicitudin, ligula
            id porttitor faucibus, tortor mauris hendrerit augue, ut molestie
            ipsum arcu
          </Typography>
          <Menu style={{ marginTop: 200 }} className={styles.menu}></Menu>
        </div>
      </div>
    );
  }
}

export default editProfile;
