import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import TopMenu from "./TopMenu";
import axios from "axios";
import { createMuiTheme } from "@mui/material/styles";
import styles from "./main.module.css";
import Typography from "@mui/material/Typography";
import Menu from "./ProfileMenuGuest.js";
import Button from "@mui/material/Button";
import EditProfile from "./editProfile";
import Thumbs from "./thumbs";
import Brightness1Icon from "@mui/icons-material/Brightness1";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleBioSave = this.handleBioSave.bind(this);
    this.handlePhotoChange = this.handlePhotoChange.bind(this);

    this.state = {
      username: "",
      bio: "",
      editing: false,
      firstName: "",
      lastName: "",
      photo: "",
      text: "Follow",
      options: [
        { key: "Option 1" },
        { key: "Option 2" },
        { key: "Option 3" },
        { key: "Option 4" },
        { key: "Option 5" },
        { key: "Option 6" },
        { key: "Option 7" },
      ],
    };

    axios
      .get("http://localhost:3001/user/currentuser", {
        withCredentials: true,
      })
      .then((json) => {
        if (json.data.username) {
          this.setState({ username: json.data.username });
        }
        if (json.data.bio) {
          this.setState({ bio: json.data.bio });
        }
        if (json.data.firstName) {
          this.setState({ firstName: json.data.firstName });
        }
        if (json.data.lastName) {
          this.setState({ lastName: json.data.lastName });
        }
        if (json.data.profilePhoto) {
          this.setState({ photo: json.data.profilePhoto });
        }
      });
  }

  handleBioChange(newBio) {
    this.setState({ bio: newBio });
  }

  changeText = (text) => {
    this.setState({ text });
  };

  handleBioSave() {
    // make update call to user bio
    axios
      .put(`http://localhost:3001/users/${this.state.username}`, {
        bio: this.state.bio,
      })
      .then((json) => {
        if (json.data.success) {
          console.log("Bio successfully updated");
        } else console.log("An error has occurred while saving your bio.");
      });
    this.setState({ editing: false });
  }

  handlePhotoChange(event, callback) {
    if (event.target.files.length > 0) {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios
        .put(
          `http://localhost:3001/users/photo/${this.state.username}`,
          formData
        )
        .then((json) => {
          if (json.data.success) {
            // Photo uploaded successfully
            console.log("PHOTO UPLOAD SUCCESS");
            this.setState({ photo: json.data.user.profilePhoto });
            callback(json.data.user.profilePhoto);
          } else {
            // Photo upload failed
            console.log("PHOTO UPLOAD FAIL");
            console.log(json);
          }
        });
    }
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
    this.style = {
      multiselectContainer: {
        textAlign: "center",
      },
      chips: {},
      searchBox: {
        border: "none",
        fontSize: "15px",
        fontFamily: "Segoe UI",
      },
      inputField: {
        fontSize: "15px",
      },
    };

    if (!this.state.editing) {
      return (
        <div>
          <TopMenu history={this.props.history}></TopMenu>
          <div className={styles.bgColor}>
            <div className={styles.profilePhoto}> </div>
            <Typography className={styles.timeZone}>
              GMT-7 Monday, April 13, 2020, 2:27 PM
            </Typography>
            <Avatar src={this.state.photo} className={styles.large} />
            <Button
              onClick={() => this.setState({ editing: true })}
              variant="contained"
              color="primary"
              size="large"
              className={styles.editProfile}
            >
              {" "}
              {this.state.text}
            </Button>
          </div>
          <div className={styles.bgColor}>
            <Typography
              className={styles.profileText}
              variant="h5"
              style={{ paddingTop: 20 }}
              align="center"
            >
              {this.state.firstName} {this.state.lastName}
            </Typography>

            <Typography className={styles.user}>@Destroyer392</Typography>
            <div style={{ margin: 15 }} className={styles.center}>
              <Typography className={styles.statusText}>
                <Brightness1Icon
                  className={styles.statusGuest}
                  style={{ color: "#26AD00" }}
                ></Brightness1Icon>
                Active
              </Typography>
              <Thumbs></Thumbs>
            </div>
            <Typography
              className={styles.profileBio}
              variant="body1"
              style={{ paddingTop: 20 }}
              align="center"
            >
              {this.state.bio}
            </Typography>
            <div className={styles.center}>
              <Typography className={styles.tagTitle}>Tags:</Typography>

              <Typography className={styles.tagsText}>
                fun, fresh, love, entertaining, cute
              </Typography>
            </div>
            <Menu style={{ marginTop: 200 }} className={styles.menu}></Menu>
          </div>
        </div>
      );
    } else {
      return (
        <EditProfile
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          bio={this.state.bio}
          photo={this.state.photo}
          onEdit={this.handleBioChange}
          onSave={this.handleBioSave}
          onPhotoChange={this.handlePhotoChange}
        ></EditProfile>
      );
    }
  }
}

export default Profile;
