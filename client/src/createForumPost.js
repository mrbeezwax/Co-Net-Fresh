import React, { Component, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TopMenu from "./TopMenu";
import axios from "axios";
import { createMuiTheme } from "@mui/material/styles";
import styles from "./App.css";
import mainStyles from "./main.module.css";
import CheckIcon from "@mui/icons-material/Check";
import algoliasearch from "algoliasearch/lite";
import Tags from "./lib/Tags";
import "./tags.css";
import { InstantSearch, Index } from "react-instantsearch-dom";

export const TagSelectedComponent = ({ hit }) => (
  <Fragment>
    <code>{hit.name}</code>
  </Fragment>
);

export const TagSuggestionComponent = ({ hit }) => (
  <Fragment>{hit.name}</Fragment>
);

class CreateForumPost extends Component {
  constructor(props) {
    super(props);
    this.handleBodyEdit = this.handleBodyEdit.bind(this);
    this.handleTitleEdit = this.handleTitleEdit.bind(this);
    this.handlePostCreate = this.handlePostCreate.bind(this);

    this.state = {
      username: "",
      title: "",
      body: "",
      game: "",
    };
  }

  componentDidMount() {
    // Retreive user data
    axios
      .get("http://localhost:3001/user/currentuser", { withCredentials: true })
      .then((json) => {
        if (json.data.username === "Guest") this.props.history.push("/Forum");
        this.setState({ username: json.data.username });
      });
  }

  handleTitleEdit(e) {
    this.setState({ title: e.target.value });
  }

  handleBodyEdit(e) {
    this.setState({ body: e.target.value });
  }

  handlePostCreate() {
    // Validate fields
    if (!this.state.game || !this.state.body || !this.state.title) {
      alert("Please fill in required fields");
      return;
    }
    // Get the app ID
    const url = this.state.game.url;
    var appID = url.search("/app/");
    if (appID !== -1) {
      var begin = url.substring(appID + 5);
      var end = begin.indexOf("/");
      appID = begin.substring(0, end);
    }
    // Create Post
    axios
      .post("http://localhost:3001/forum/createPostOrReply", {
        username: this.state.username,
        body: this.state.body,
        game: this.state.game.name,
        gameID: this.state.game._id,
        appID: appID,
        title: this.state.title,
      })
      .then((json) => {
        if (json.data.success) {
          axios
            .put(`http://localhost:3001/users/addPost/${this.state.username}`, {
              postID: json.data.forumPostObj._id,
            })
            .then((json2) => {
              if (json2.data.success)
                this.props.history.push(
                  `/forumPost/${json.data.forumPostObj._id}`
                );
            });
        } else alert("Something went wrong. Please try again");
      });
  }

  render() {
    const client = algoliasearch(
      "T7MES4D4M7",
      "3fc5bf346a8a53b2ef1c596cf747cb02"
    );

    const onAddTag = (hit) => {
      return hit;
    };

    const onTagsUpdated = (actualTags, previousTags) => {
      this.setState({ game: actualTags[0] });
    };

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

    // const state = {
    //   options:[
    //     { name: "League", },
    //     { name: "Minecraft", },
    //     { name: "Valorant", },
    //     { name: "CSGO", },
    //     { name: "Mario Kart", },
    //     { name: "Animal Crossing", },
    //     { name: "Tic Tac Toe", }
    //   ],
    // };

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
          margin: useTheme().spacing(1.5),
        },
        "& hr": {
          margin: useTheme().spacing(0, 0.5),
        },
      },
    };

    const { body, title } = this.state;

    return (
      <div>
        <TopMenu history={this.props.history}></TopMenu>
        <div className="content">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography
                style={titleStyle}
                align="Left"
                variant="h4"
                component="h2"
              >
                Create Forum Post
              </Typography>
            </Grid>
          </Grid>
          <TextField
            id="title"
            label="Title"
            placeholder="Enter a post title"
            onChange={this.handleTitleEdit}
            required={true}
            value={title}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            className={mainStyles.titleInput}
            variant="outlined"
          />
          <div className={styles.multiselectGame}>
            <InstantSearch searchClient={client} indexName="co-net_games">
              <Index indexName="co-net_games">
                <Tags
                  selectedTagComponent={TagSelectedComponent}
                  suggestedTagComponent={TagSuggestionComponent}
                  onAddTag={onAddTag}
                  onUpdate={onTagsUpdated}
                  limitedTo={1}
                  className={styles.multiselectGame}
                  translations={{
                    placeholder: "Game Name",
                    noResult: "Game not found.",
                  }}
                />
              </Index>
            </InstantSearch>
          </div>
          <div style={{ marginRight: 20 }}>
            <TextField
              id="postbody"
              label="What's your post about?"
              multiline
              rows="10"
              placeholder="Enter some details..."
              variant="outlined"
              className={mainStyles.bodyInput}
              required={true}
              value={body}
              onChange={this.handleBodyEdit}
            ></TextField>
            <div className={mainStyles.buttonMargins}>
              <Button
                onClick={() => this.props.history.push("/Forum")}
                className={mainStyles.cancelButton}
                variant="contained"
              >
                Cancel
              </Button>

              <Button
                onClick={this.handlePostCreate}
                id="createPostButton"
                className={mainStyles.postButton}
                color="primary"
                variant="contained"
              >
                <CheckIcon style={{ marginRight: 6 }}></CheckIcon>Create Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateForumPost;
