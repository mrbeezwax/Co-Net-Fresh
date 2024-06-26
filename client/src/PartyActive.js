import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./main.module.css";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import UserCard from "./UserCard";
import axios from "axios";
import { Link } from "@mui/material";

export default function AlertDialog(props) {
  const [open1, setOpen1] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [maxPlayers, setMaxPlayers] = React.useState(0);
  const [game, setGame] = React.useState("");
  const [leader, setLeader] = React.useState("");
  const [gameID, setGameID] = React.useState("");
  const [leaderAvatar, setLeaderAvatar] = React.useState("");
  const { history } = props;

  const handleClickOpenUp = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const handleLeaveParty = () => {
    // Check if user is party leader. If is, then delete party
    // Deleting member's currentPartyId is handled on backend
    if (props.username === leader) {
      axios
        .delete(`http://localhost:3001/party/${props.username}`)
        .then((json) => {
          console.log(json.data);
          if (json.data.success) {
            window.location.reload(false);
          }
        });
    } else {
      // axios call remove member
      axios
        .put(`http://localhost:3000/party/removePartyMember/${props.partyID}`, {
          username: props.username,
        })
        .then((json) => {
          if (json.data.success) {
            window.location.reload(false);
          }
        });
    }
  };

  useEffect(() => {
    if (!props.partyID || props.username === "Guest") return;
    axios
      .get(`http://localhost:3001/party/id/${props.partyID}`)
      .then((json) => {
        // Get Current Party Info
        // Game Name
        // Leader
        // Leader's avatar
        // Max Players
        // Members
        const party = json.data.party;
        const game = party.game;
        const maxPlayers = party.maxPlayers;
        const members = party.partyMembers;
        const leader = party.partyLeader;
        const gameID = party.gameID;
        // Render User Cards
        var userCards = [];
        members.forEach((member) => {
          const cmp = (
            <Grid item xs={6}>
              <UserCard username={member.username}></UserCard>
            </Grid>
          );
          userCards.push(cmp);
        });
        setCards(userCards);
        setMaxPlayers(maxPlayers);
        setGame(game);
        setLeader(leader);
        setGameID(gameID);
        // Get leader's Avatar
        axios
          .get(`http://localhost:3001/users/photo/${leader}`)
          .then((json) => {
            if (json.data.profilePhoto) {
              setLeaderAvatar(json.data.profilePhoto);
            }
          });
      });
  }, [props.partyID, props.username]);

  const style = {
    multiselectContainer: {
      textAlign: "center",
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

  return (
    <div style={{ display: "inline" }}>
      <Typography className="menuButtons" onClick={handleClickOpenUp}>
        Current Party
      </Typography>
      <Dialog
        maxWidth="sm"
        open={open1}
        fullWidth
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialogBoxParty}
      >
        <DialogTitle id="alert-dialog-title">
          {"Party for"}
          <Typography
            className={styles.partyGame}
            onClick={() => history.push(`/game/${gameID}`)}
          >
            {game}
          </Typography>
        </DialogTitle>
        <DialogContent className={styles.dialogBoxParty}>
          <Grid container spacing={1}>
            <Grid item></Grid>
            <Grid item xs={11}>
              <Grid container spacing={8}>
                <Grid item xs={1}>
                  <Avatar src={leaderAvatar} className={styles.smallSize} />
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    className={styles.friendUsername}
                    display="inline"
                  >
                    <Link href={`/profile/${leader}`}>{leader}</Link>
                  </Typography>
                  <Typography className={styles.timeStamp} display="inline">
                    Party Owner
                  </Typography>
                  <Typography variant="body1" className={styles.commentBody}>
                    Max Players: {maxPlayers}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid style={{ marginTop: 20 }} container spacing={1}>
            {cards}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLeaveParty} color="primary">
            Leave Party
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
