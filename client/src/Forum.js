import React, { Component } from "react";
import Button from "@mui/material/Button";
//import FormControlLabel from '@mui/material/FormControlLabel';
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import TopMenu from "./TopMenu";
import axios from "axios";
import { createMuiTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import mainStyles from "./main.module.css";
import Divider from "@mui/material/Divider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTheme } from "@mui/material/styles";

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

class Forum extends Component {
  constructor(props) {
    super(props);
    this.createPost = this.createPost.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.getReply = this.getReply.bind(this);

    this.state = {
      allPosts: [
        {
          parentId: "",
          title: "",
          allReplyIDs: [],
          timePosted: "",
          body: "",
          game: "",
          username: "",
        },
      ],
      cards: [],
      timeZone: "America/Los_Angeles",
    };
  }

  createPost() {
    if (this.state.username === "Guest") alert("You must be signed in to post");
    this.props.history.push("/createForumPost");
  }

  // Returns
  // If Post = Month Day, Year
  // If Reply,
  //  If Today = Today, HH:MM PM
  //  If Yesterday = Yesterday, HH:MM PM
  //  Else = Month Day, Year
  convertTime(time, reply) {
    var d = new Date(time);
    const month = monthNames[d.getMonth()];
    if (reply) {
      const today = new Date();
      var localTime = d.toLocaleString("en-US", {
        timeZone: this.state.timeZone,
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
    }
    return `${month} ${d.getDate()}, ${d.getFullYear()}`;
  }

  getReply(id) {
    if (id === null) return null;
    return axios.get(`http://localhost:3001/forum/${id}`).then((json) => {
      return json.data;
    });
  }

  componentDidMount() {
    // Retreive user data
    axios
      .get("http://localhost:3001/user/currentuser", { withCredentials: true })
      .then((json) => {
        if (json.data.username) this.setState({ username: json.data.username });
        if (json.data.timeZone) this.setState({ timeZone: json.data.timeZone });
        axios.get("http://localhost:3001/forum/").then((json) => {
          this.setState({ allPosts: json.data.forumPostObj });

          // Get All Replies
          // Using Promise Strategy
          const cards = [];
          let promArr = this.state.allPosts
            .filter((postFilter) => {
              // If it is a reply, don't display
              if (postFilter.parentID != 0) return false;
              return true;
            })
            .map(async function (post) {
              const title = post.title;
              const timePosted = post.timePosted;
              const game = post.game;
              const gameID = post.gameID;
              const user = post.username;
              const postID = post._id;
              const votes = post.votes;
              // Base: steamcdn-a.akamaihd.net/steam/apps/{app_id}/header.jpg
              const imageURL = `https://steamcdn-a.akamaihd.net/steam/apps/${post.appID}/header.jpg`;
              if (post.allReplyIDs.length > 0) {
                const json = await axios.get(
                  `http://localhost:3001/forum/${
                    post.allReplyIDs[post.allReplyIDs.length - 1].childID
                  }`
                );
                var replyUser;
                var replyDate;
                if (json) {
                  replyUser = json.data.username;
                  replyDate = json.data.timePosted;
                }
              }
              return {
                title: title,
                timePosted: timePosted,
                game: game,
                gameID: gameID,
                url: imageURL,
                user: user,
                replyUser: replyUser,
                replyDate: replyDate,
                numOfComments: post.allReplyIDs.length,
                postID: postID,
                votes: votes,
              };
            });

          Promise.all(promArr)
            .then((res) => {
              res.forEach((comp) => {
                cards.unshift(comp);
              });
              this.setState({ cards: cards });
            })
            .catch(function (err) {
              console.log("ERROR");
              console.log(err);
            });
        });
      });
  }

  render() {
    const { cards } = this.state;

    const theme = createMuiTheme({
      "@global": {
        body: {
          backgroundColor: "white",
        },
      },
    });

    const titleStyle = {
      marginTop: 20,
      color: "#535353",
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

    const renderCards = [];
    // Render each card
    let index = 0;
    cards.forEach((card) => {
      const postTimestamp = this.convertTime(card.timePosted, false);
      const replyTimestamp = card.replyDate
        ? this.convertTime(card.replyDate, true)
        : "";

      const renderCard = (
        <Card
          key={card.postID}
          className={mainStyles.postSpacing}
          id={"post" + index}
        >
          <CardContent className={mainStyles.forumCard}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <img className={mainStyles.photo} src={card.url} />
              </Grid>
              <Grid item xs={6}>
                <div className={mainStyles.gameAndTitle}>
                  <Typography
                    // onClick=Game Info Pop-up
                    display="inline"
                    color="primary"
                    component="h2"
                    fontsize={18}
                    align="center"
                    className={mainStyles.gameName}
                    id="server-modal-title"
                  >
                    <Link href={`/game/${card.gameID}`}>{card.game}</Link>
                  </Typography>{" "}
                  <Typography
                    className={mainStyles.forumTitle}
                    display="inline"
                    component="h2"
                    fontsize={18}
                    align="center"
                  >
                    <Link
                      id={"title" + index++}
                      style={{ color: "#A4A4A4" }}
                      href={`/forumPost/${card.postID}`}
                    >
                      {card.title}
                    </Link>
                  </Typography>
                </div>
                <Typography
                  onClick={() =>
                    this.props.history.push(`/profile/${card.user}`)
                  }
                  style={{ cursor: "pointer", color: "#3f51b5" }}
                  className={mainStyles.userName}
                  display="inline"
                >
                  {card.user}{" "}
                </Typography>
                <Typography className={mainStyles.timeStamp} display="inline">
                  {postTimestamp}
                </Typography>
              </Grid>
              <Grid item xs>
                <Grid
                  container
                  alignItems="center"
                  className={dividerGridStyle.root}
                >
                  <Grid item xs>
                    <div className={mainStyles.marginBottom}>
                      <Typography
                        className={mainStyles.timeStamp}
                        display="inline"
                      >
                        Comments{": "}
                      </Typography>
                      <Typography
                        className={mainStyles.userName}
                        display="inline"
                      >
                        {card.numOfComments}{" "}
                      </Typography>
                    </div>
                    <Typography
                      className={mainStyles.timeStamp}
                      display="inline"
                    >
                      Votes:{" "}
                    </Typography>
                    <Typography
                      className={mainStyles.userName}
                      display="inline"
                    >
                      {card.votes}{" "}
                    </Typography>
                  </Grid>
                  <Divider
                    className={mainStyles.divider}
                    orientation="vertical"
                    flexItem
                  />
                  <Grid item xs>
                    <div className={mainStyles.marginBottom}>
                      <Typography
                        className={mainStyles.userName}
                        display="inline"
                        style={
                          card.replyUser
                            ? { cursor: "pointer", color: "#3f51b5" }
                            : null
                        }
                        onClick={
                          card.replyUser
                            ? () =>
                                this.props.history.push(
                                  `/profile/${card.replyUser}`
                                )
                            : null
                        }
                      >
                        {card.replyUser ? card.replyUser : "No comments"}{" "}
                      </Typography>
                    </div>
                    <Typography
                      className={mainStyles.timeStamp}
                      display="inline"
                    >
                      {replyTimestamp ? replyTimestamp : ""}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
      renderCards.push(renderCard);
    });

    return (
      <div>
        <TopMenu history={this.props.history}></TopMenu>
        <div className="content">
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <Typography
                id="Forum"
                style={titleStyle}
                align="Left"
                variant="h4"
                component="h2"
              >
                Forum
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button
                onClick={this.createPost}
                id="createForumPost"
                style={{
                  textTransform: "none",
                  marginTop: 28,
                  padding: 10,
                  marginBottom: 10,
                }}
                color="primary"
                variant="contained"
              >
                <AddCircleIcon style={{ marginRight: 6 }}></AddCircleIcon>Create
                Post
              </Button>
            </Grid>
            <Grid item xs={3}>
              <div style={{}}>
                <Button
                  size="large"
                  style={{
                    textTransform: "none",
                    marginTop: 28,
                    padding: 10,
                    marginRight: 40,
                    float: "right",
                  }}
                >
                  Filter by:
                  <FilterListIcon style={{ marginLeft: 20 }}></FilterListIcon>
                </Button>
              </div>
            </Grid>
          </Grid>

          {renderCards}
        </div>
      </div>
    );
  }
}

export default Forum;
