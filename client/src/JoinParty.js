import React from "react";
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
import MuiAlert from "@mui/lab/Alert";
import { Link } from "@mui/material";
import axios from "axios";
import mainStyles from "./main.module.css";

export default function AlertDialog(props) {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  // const [joined, setJoined] = React.useState(false);

  const handleClickOpenUp = () => {
    if (props.currentUser === "Guest") {
      alert("You must be signed in to join a party.");
      return;
    } else if (props.inOtherParty) {
      alert("You must leave your current party first before joining.");
      return;
    }
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const handleCloseJoinedParty = () => {
    // axios call add party member
    axios
      .put(`http://localhost:3000/party/addPartyMember/${props.party._id}`, {
        username: props.currentUser,
      })
      .then((json) => {
        if (json.data.success) {
          setOpen1(false);
          window.location.reload(false);
        }
      });
  };

  const handleLeaveParty = () => {
    // Check if user is party leader. If is, then delete party
    // Deleting member's currentPartyId is handled on backend
    if (props.currentUser === props.party.partyLeader) {
      axios
        .delete(`http://localhost:3001/party/${props.currentUser}`)
        .then((json) => {
          console.log(json.data);
          if (json.data.success) {
            window.location.reload(false);
          }
        });
    } else {
      // axios call remove member
      axios
        .put(
          `http://localhost:3000/party/removePartyMember/${props.party._id}`,
          {
            username: props.currentUser,
          }
        )
        .then((json) => {
          if (json.data.success) {
            window.location.reload(false);
          }
        });
    }
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

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

  const gameDesc = {
    color: "#535353",
    marginTop: 5,
    marginLeft: 8,
  };

  var renderUserCards = [];
  props.party.partyMembers.forEach((member) => {
    const cmp = (
      <Grid item xs={6}>
        <UserCard username={member.username}></UserCard>
      </Grid>
    );
    renderUserCards.push(cmp);
  });

  // Show Join, Leave, or Full
  var partyButton;
  if (props.inParty) {
    partyButton = (
      <Button
        onClick={handleLeaveParty}
        variant="contained"
        style={{ float: "right" }}
      >
        Leave
      </Button>
    );
  } else if (props.party.partyMembers.length + 1 >= props.party.maxPlayers) {
    partyButton = (
      <Typography
        variant="contained"
        className={mainStyles.gameTags}
        style={{ float: "right" }}
      >
        Party is Full
      </Typography>
    );
  } else {
    partyButton = (
      <Button
        onClick={handleClickOpenUp}
        color="secondary"
        variant="contained"
        style={{ float: "right" }}
      >
        Join
      </Button>
    );
  }

  return (
    <div style={{ display: "inline" }}>
      {partyButton}

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
          <Typography className={styles.partyGame}>
            <Link href={`/game/${props.gameID}`}>{props.game}</Link>
          </Typography>
        </DialogTitle>
        <DialogContent className={styles.dialogBoxParty}>
          <Grid container spacing={1}>
            <Grid item></Grid>
            <Grid item xs={11}>
              <Grid container spacing={8}>
                <Grid item xs={1}>
                  <Avatar
                    src={props.leaderAvatar}
                    className={styles.smallSize}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    className={styles.friendUsername}
                    display="inline"
                  >
                    <Link href={`/profile/${props.party.partyLeader}`}>
                      {props.party.partyLeader}
                    </Link>
                  </Typography>
                  <Typography className={styles.timeStamp} display="inline">
                    Party Owner
                  </Typography>
                  <Typography variant="body1" className={styles.commentBody}>
                    Max Players: {props.party.maxPlayers}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid style={{ marginTop: 20 }} container spacing={1}>
            {renderUserCards}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseJoinedParty} color="primary" autoFocus>
            Join Party
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
