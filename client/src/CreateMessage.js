import React, { Component, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TopMenu from "./TopMenu";
import axios from "axios";
import { createMuiTheme } from "@mui/material/styles";
import mainStyles from "./main.module.css";
import CheckIcon from "@mui/icons-material/Check";
import algoliasearch from "algoliasearch/lite";
import Tags from "./lib/Tags";
import "./tags.css";
import { InstantSearch, Index } from "react-instantsearch-dom";

export const TagSelectedComponent = ({ hit }) => (
  <Fragment>
    <code>{hit.username}</code>
  </Fragment>
);

export const TagSuggestionComponent = ({ hit }) => (
  <Fragment>{hit.username}</Fragment>
);

class CreateMessage extends Component {
  constructor(props) {
    super(props);
    this.handleBodyEdit = this.handleBodyEdit.bind(this);
    this.handleMessageCreate = this.handleMessageCreate.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this);

    this.state = {
      username: "",
      recipient: "",
      body: "",
      friends: [],
    };
  }

  componentDidMount() {
    // Retreive user data
    axios
      .get("http://localhost:3001/user/currentuser", { withCredentials: true })
      .then((json) => {
        if (json.data.username === "Guest") this.props.history.push("/Forum");
        this.setState({
          username: json.data.username,
          friends: json.data.friends,
        });
      });
  }

  handleBodyEdit(e) {
    this.setState({ body: e.target.value });
  }

  handleMessageSend(threadID) {
    // Add message to thread
    axios
      .put(
        `http://localhost:3001/messageThread/addMessageToThread/${threadID}`,
        {
          sentBy: this.state.username,
          message: this.state.body,
        }
      )
      .then((json) => {
        if (json.data.success) {
          console.log("Message sent");
          this.props.history.push("/messages");
        }
      });
  }

  handleMessageCreate() {
    // Validate fields
    if (!this.state.body || !this.state.recipient) {
      alert("Please fill out required fields");
      return;
    }
    // Create Message
    // If user already had a conversation with recipient, than only add the new message to sharedMessages
    axios
      .get(`http://localhost:3001/messageThread/${this.state.username}`)
      .then((json) => {
        const thread = json.data.find(
          (t) =>
            t["username1"] === this.state.recipient ||
            t["username2"] === this.state.recipient
        );
        if (thread) {
          this.handleMessageSend(thread._id);
          return;
        } else {
          // If new message thread, then create
          axios
            .post("http://localhost:3001/messageThread/create", {
              username1: this.state.username,
              username2: this.state.recipient,
              message: this.state.body,
              sentBy: this.state.username,
            })
            .then((json) => {
              if (json.data.success) {
                console.log("Message created");
                console.log(json.data);
                this.props.history.push("/messages");
              } else alert("Something went wrong. Please try again");
            });
        }
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
      if (actualTags.length == 0) this.setState({ recipient: "" });
      else this.setState({ recipient: actualTags[0].username });
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

    const { body } = this.state;

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
                Compose Message
              </Typography>
            </Grid>
          </Grid>
          {/* <TextField
            id="title"
            label="User"
            placeholder="Enter a user to message"
            onChange={this.handleTitleEdit}
            required={true}
            value={title}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            className={mainStyles.titleInput}
            variant="outlined"
          /> */}
          <div style={{ marginRight: 20 }}>
            <InstantSearch searchClient={client} indexName="co-net_users">
              <Index indexName="co-net_users">
                <Tags
                  selectedTagComponent={TagSelectedComponent}
                  suggestedTagComponent={TagSuggestionComponent}
                  friends={this.state.friends}
                  onAddTag={onAddTag}
                  onUpdate={onTagsUpdated}
                  limitedTo={1}
                  translations={{
                    placeholder: "Username",
                    noResult: "User not found.",
                  }}
                />
              </Index>
            </InstantSearch>
            <TextField
              id="postbody"
              label="What's your message?"
              multiline
              rows="10"
              placeholder="Enter some details..."
              variant="outlined"
              style={{ marginLeft: "0px", marginTop: "4px", width: "100%" }}
              required={true}
              value={body}
              onChange={this.handleBodyEdit}
            ></TextField>
            <div className={mainStyles.buttonMargins}>
              <Button
                onClick={() => this.props.history.push("/Feed")}
                className={mainStyles.cancelButton}
                variant="contained"
              >
                Cancel
              </Button>

              <Button
                onClick={this.handleMessageCreate}
                id="createMessageButton"
                className={mainStyles.postButton}
                color="primary"
                variant="contained"
              >
                <CheckIcon style={{ marginRight: 6 }}></CheckIcon>Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateMessage;
