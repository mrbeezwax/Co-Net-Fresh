import React from "react";
//import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import leaguePhoto from "./leaguePhoto.jpg";
import Brightness1Icon from "@mui/icons-material/Brightness1";

export default function Games(props) {
  const titleStyle = {
    marginBottom: 20,
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
    <div className="content">
      <Grid container spacing={3}>
        <Typography style={titleStyle} align="Left" variant="h6" component="h2">
          {props.title}
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <img className="photos" src={leaguePhoto} />
          <Typography style={gameTitle}>League of Legends</Typography>
          <div style={{ display: "inline-flex" }}>
            <Brightness1Icon
              style={{ color: "#26AD00", marginTop: "4" }}
            ></Brightness1Icon>
            <Typography style={gameDesc}>1492 players looking now</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <img className="photos" src={leaguePhoto} />
          <Typography style={gameTitle}>League of Legends</Typography>
          <div style={{ display: "inline-flex" }}>
            <Brightness1Icon
              style={{ color: "#26AD00", marginTop: "4" }}
            ></Brightness1Icon>
            <Typography style={gameDesc}>1492 players looking now</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <img className="photos" src={leaguePhoto} />
          <Typography style={gameTitle}>League of Legends</Typography>
          <div style={{ display: "inline-flex" }}>
            <Brightness1Icon
              style={{ color: "#26AD00", marginTop: "4" }}
            ></Brightness1Icon>
            <Typography style={gameDesc}>1492 players looking now</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <img className="photos" src={leaguePhoto} />
          <Typography style={gameTitle}>League of Legends</Typography>
          <div style={{ display: "inline-flex" }}>
            <Brightness1Icon
              style={{ color: "#26AD00", marginTop: "4" }}
            ></Brightness1Icon>
            <Typography style={gameDesc}>1492 players looking now</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <img className="photos" src={leaguePhoto} />
          <Typography style={gameTitle}>League of Legends</Typography>
          <div style={{ display: "inline-flex" }}>
            <Brightness1Icon
              style={{ color: "#26AD00", marginTop: "4" }}
            ></Brightness1Icon>
            <Typography style={gameDesc}>1492 players looking now</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <img className="photos" src={leaguePhoto} />
          <Typography style={gameTitle}>League of Legends</Typography>
          <div style={{ display: "inline-flex" }}>
            <Brightness1Icon
              style={{ color: "#26AD00", marginTop: "4" }}
            ></Brightness1Icon>
            <Typography style={gameDesc}>1492 players looking now</Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
