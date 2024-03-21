import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./main.module.css";
import TextField from "@mui/material/TextField";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/lab/Alert";
import axios from "axios";

export default function AlertDialog() {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [newTagName, setTagName] = React.useState("");

  const handleClickOpenUp = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const handleClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
    setOpen3(false);
  };

  function onCreateTag(newTagName) {
    const tagName = newTagName;

    axios
      .post(`http://localhost:3001/userTags/create`, {
        name: tagName,
      })
      .then((json) => {
        if (json.data.success) {
          //this.setState({created: true})
          setOpen3(true);
          console.log("User Tag Created!");
          window.location.reload();
        } else {
          //this.setState({created: false})
          setOpen2(true);
          console.log("Error in user tag creation");
        }
      });
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <div style={{ display: "inline" }}>
      <AddCircleIcon
        onClick={handleClickOpenUp}
        className={styles.addTags}
      ></AddCircleIcon>{" "}
      <Dialog
        maxWidth="sm"
        open={open1}
        fullWidth
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialogBox}
      >
        <DialogTitle id="alert-dialog-title">{"Create a Tag"}</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            placeholder="Enter a Tag"
            name="newTagName"
            value={newTagName}
            onChange={(e) => setTagName(e.target.value)}
          ></TextField>
          <Button
            style={{ marginTop: 9, marginLeft: 12 }}
            onClick={() => {
              onCreateTag(newTagName);
            }}
            color="primary"
          >
            Add Tag
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Done
          </Button>
          <Snackbar open={open2} autoHideDuration={900} onClose={handleClose1}>
            <Alert onClose={handleClose} severity="error">
              Tag Already Exists!
            </Alert>
          </Snackbar>
          <Snackbar open={open3} autoHideDuration={900} onClose={handleClose1}>
            <Alert severity="success">User Tag Created!</Alert>
          </Snackbar>
        </DialogActions>
      </Dialog>
    </div>
  );
}
