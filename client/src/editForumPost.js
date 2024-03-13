/* eslint-disable no-use-before-define */
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import { createMuiTheme } from "@material-ui/core/styles";
import mainStyles from "./main.module.css";
import CheckIcon from "@material-ui/icons/Check";

class EditForumPost extends Component {
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

    const gameList = [
      "League of Legends",
      "Counter Strike",
      "Fortnite",
      "Portal",
      "Minecraft",
    ];

    const state = {
      options: [
        { key: "League" },
        { key: "Minecraft" },
        { key: "Valorant" },
        { key: "CSGO" },
        { key: "Mario Kart" },
        { key: "Animal Crossing" },
        { key: "Tic Tac Toe" },
      ],
    };

    const style = {
      multiselectContainer: {
        textAlign: "center",
        width: "70%",
        marginLeft: "10px",
      },
      chips: {},
      searchBox: {
        fontSize: "15px",
        fontFamily: "Segoe UI",
        width: "69%",
        marginLeft: "10px",
        height: "40px",
      },
      inputField: {
        fontSize: "15px",
        marginTop: "10px",
      },
    };

    const dividerGridStyle = {
      root: {
        width: "fit-content",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        "& svg": {
          margin: theme.spacing(1.5),
        },
        "& hr": {
          margin: theme.spacing(0, 0.5),
        },
      },
    };

    const { title, body } = this.props;

    return (
      <div>
        <div className="content">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography
                style={titleStyle}
                align="Left"
                variant="h4"
                component="h2"
              >
                Edit Forum Post
              </Typography>
            </Grid>
          </Grid>
          <TextField
            id="outlined-full-width"
            label="Title"
            defaultValue="Looking for Duo in Ranked, I'm Gold"
            value={title}
            onChange={this.props.onTitleEdit}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            className={mainStyles.titleInput}
            variant="outlined"
          />
          {/* <Multiselect
          options={state.options}
          displayValue="key"
          style={style}
          className = {mainStyles.multiselectGame}
          placeholder = "Choose Game"
          selectionLimit = {1}

        />   */}

          <div style={{ marginRight: 20 }}>
            <TextField
              id="outlined-multiline-static"
              label="What's your post about?"
              multiline
              rows="10"
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus."
              value={body}
              onChange={this.props.onBodyEdit}
              variant="outlined"
              className={mainStyles.bodyInput}
            ></TextField>
            <div className={mainStyles.buttonMargins}>
              <Button
                onClick={this.props.onCancel}
                className={mainStyles.cancelButton}
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={this.props.onDelete}
                id="deletepostButton"
                className={mainStyles.cancelButton}
                color="secondary"
                variant="contained"
              >
                Delete Post
              </Button>

              <Button
                onClick={this.props.onSave}
                className={mainStyles.postButton}
                color="primary"
                variant="contained"
              >
                <CheckIcon style={{ marginRight: 6 }}></CheckIcon>Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditForumPost;
