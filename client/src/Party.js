import React, { Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./main.module.css";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import axios from "axios";
import { InstantSearch, Index } from "react-instantsearch-dom";
import Tags from "./lib/Tags";
import algoliasearch from "algoliasearch/lite";
import "./tags.css";

export const TagSelectedComponent = ({ hit }) => (
  <Fragment>
    <code>{hit.name}</code>
  </Fragment>
);

export const TagSuggestionComponent = ({ hit }) => (
  <Fragment>{hit.name}</Fragment>
);

export default function AlertDialog(props) {
  const [open1, setOpen1] = React.useState(false);
  const [partyCreated, setPartyCreated] = React.useState(false);
  const [selectedGame, setSelectedGame] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);

  const handleClickOpenUp = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const handleDone = () => {
    if (!selectedGame) {
      alert("Please choose a game");
      return;
    }
    if (!max) {
      alert("Please select max players");
    }
    axios
      .post(`http://localhost:3001/party/create`, {
        partyLeader: props.username,
        gameID: selectedGame._id,
        maxPlayers: max,
      })
      .then((json) => {
        if (json.data.success) {
          handleClose();
          setPartyCreated(true);
        }
      });
  };

  const handleCancel = () => {
    handleClose();
  };

  React.useEffect(() => {
    if (partyCreated) {
      setRedirect(true);
    }
  }, [partyCreated]);

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

  const marks = [
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 8,
      label: "8",
    },
    {
      value: 9,
      label: "9",
    },
    {
      value: 10,
      label: "10",
    },
  ];

  // Game Selection
  const client = algoliasearch(
    process.env.REACT_APP_ALGOLIA_APP_ID,
    process.env.REACT_APP_ALGOLIA_SEARCH_KEY
  );

  const onAddTag = (hit) => {
    return hit;
  };

  const onTagsUpdated = (actualTags, previousTags) => {
    setSelectedGame(actualTags[0]);
  };

  var max;
  return (
    <div style={{ display: "inline" }}>
      <Typography className="menuButtons" onClick={handleClickOpenUp}>
        Create Party
      </Typography>
      {redirect ? redirect(`/game/${selectedGame._id}`) : null}
      <Dialog
        maxWidth="sm"
        open={open1}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialogBox}
      >
        <DialogTitle id="alert-dialog-title">{"Create a Party"}</DialogTitle>
        <DialogContent className={styles.dialogBox}>
          <div>
            <InstantSearch searchClient={client} indexName="co-net_games">
              <Index indexName="co-net_games">
                <Tags
                  selectedTagComponent={TagSelectedComponent}
                  suggestedTagComponent={TagSuggestionComponent}
                  onAddTag={onAddTag}
                  onUpdate={onTagsUpdated}
                  limitTo={1}
                  translations={{
                    placeholder: "Game Name",
                    noResult: "Game not found.",
                  }}
                />
              </Index>
            </InstantSearch>
          </div>
          <Typography className={styles.centerText}>Party Size</Typography>
          <Slider
            aria-labelledby="discrete-slider-custom"
            step={1}
            min={2}
            max={10}
            onChange={(e, value) => (max = value)}
            marks={marks}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            id="createPartyDone"
            onClick={handleDone}
            color="primary"
            autoFocus
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
