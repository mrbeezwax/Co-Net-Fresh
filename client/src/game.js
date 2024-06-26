import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TopMenu from "./TopMenu";
import axios from "axios";
import { createMuiTheme } from "@mui/material/styles";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import mainStyles from "./main.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import GameMenu from "./GameMenu";
import Error404 from "./Error404";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { key: "fun" },
        { key: "love" },
        { key: "vibing" },
        { key: "OMOMO" },
        { key: "7Leaves" },
        { key: "HappyLemonIsTrash" },
        { key: "TasteaIsFTier" },
      ],
      numOfPlayersPlaying: 0,
      gameTags: [],
      id: 0,
      url: "",
      description: "",
      release_date: "",
      name: "",
      image: "",
      parties: [],
      playersPlaying: [],
      error: false,
      currentUser: "",
      inOtherParty: false,
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3001/user/currentuser", { withCredentials: true })
      .then((userJson) => {
        // Do something with user data, check if in party and get party id
        axios
          .get(
            `http://localhost:3001/games/id/${this.props.match.params.gameID}`
          )
          .then((json) => {
            if (!json.data.success) {
              this.setState({ error: true });
              return;
            }
            const game = json.data.gameObj;
            // Code to grab game image using app id and url
            var appID = game.url.search("/app/");
            var imageURL = "";
            if (appID !== -1) {
              var begin = game.url.substring(appID + 5);
              var end = begin.indexOf("/");
              appID = begin.substring(0, end);
              // steamcdn-a.akamaihd.net/steam/apps/{app_id}/header.jpg
              imageURL = `https://steamcdn-a.akamaihd.net/steam/apps/${appID}/header.jpg`;
              // console.log(imageURL);
            }
            this.setState({
              gameTags: game.gameTags,
              id: game._id,
              url: game.url,
              description: game.description,
              release_date: game.releaseDate,
              name: game.name,
              image: imageURL,
              currentUser: userJson.data.username,
              inOtherParty: userJson.data.currentPartyId.length != 0,
            });

            // Get parties playing this game
            axios
              .get(`http://localhost:3001/party/game/${this.state.id}`)
              .then((json) => {
                if (json.data.parties.length > 0) {
                  var numOfPlayersPlaying = 0;
                  json.data.parties.forEach((party) => {
                    numOfPlayersPlaying += party.partyMembers.length + 1;
                  });
                  this.setState({
                    parties: json.data.parties,
                    numOfPlayersPlaying: numOfPlayersPlaying,
                  });
                }
              });
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

    const gameDesc = {
      color: "#535353",
      marginTop: 5,
      marginLeft: 8,
    };

    const about = {
      color: "black",
      marginTop: 5,
      marginLeft: 8,
    };

    this.style = {
      multiselectContainer: {
        marginBottom: "40px",
        width: "800px",
        marginLeft: "2%",
      },
      chips: {},
      searchBox: {
        fontSize: "15px",
        fontFamily: "Segoe UI",
      },
      inputField: {
        fontSize: "15px",
      },
    };

    const {
      name,
      release_date,
      description,
      url,
      gameTags,
      numOfPlayersPlaying,
      image,
      parties,
      error,
      currentUser,
      inOtherParty,
    } = this.state;

    if (error) return <Error404></Error404>;
    return (
      <div>
        <TopMenu history={this.props.history}></TopMenu>
        <div className="content">
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <img className={mainStyles.gamePhoto} src={image} />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h3" className={mainStyles.gametitleBig}>
                {name}
              </Typography>
              <div style={{ display: "inline-flex" }}>
                <Brightness1Icon
                  style={{ color: "#26AD00", marginTop: "4" }}
                ></Brightness1Icon>
                <Typography style={gameDesc}>
                  {numOfPlayersPlaying == 1
                    ? "1 player playing now"
                    : numOfPlayersPlaying + " players playing now"}
                </Typography>
              </div>
              <Typography className={mainStyles.gameTags} style={gameDesc}>
                Tags: {gameTags.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Card className={mainStyles.postSpacing}>
                <CardContent className={mainStyles.forumCard}>
                  <Typography variant="h6" style={about}>
                    About:
                  </Typography>
                  <Typography style={gameDesc}>
                    Released {release_date}
                  </Typography>
                  <Typography style={gameDesc}>{description}</Typography>
                  <Typography style={gameDesc}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <GameMenu
            currentUser={currentUser}
            inOtherParty={inOtherParty}
            game={name}
            gameID={this.props.match.params.gameID}
            parties={parties}
          ></GameMenu>

          {/* <Typography variant="h5" className={mainStyles.gametitleBig}>
            Parties playing:
          </Typography>



        </CardContent>
        </Card>

      </Grid>
     
      
    </Grid>
    <GameMenu></GameMenu>

   


    </div>
    </div>
  
          <Multiselect
            options={this.state.options}
            displayValue="key"
            style={this.style}
            placeholder="Search by Tag"
          />
          {partyCards} */}
        </div>
      </div>
    );
  }
}

export default Game;
