import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import logo from "./logo.png";
import axios from "axios";
import styles from "./main.module.css";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles(() => ({
  root: {
    transform: "translateZ(0)",
    height: 768,
    flexGrow: 1,
  },

  modal: {
    display: "flex",
    padding: useTheme().spacing(1),
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    overflow: "hidden",
  },
  paper: {
    width: 400,
    height: 400,

    backgroundColor: useTheme().palette.background.paper,
    border: "0.5px solid #a9a9a9",
    borderRadius: 10,
    boxShadow: useTheme().shadows[5],
    padding: useTheme().spacing(2, 4, 3),
    marginBottom: 200,
    marginRight: 400,
  },
  error: {
    backgroundColor: "#FFCCCC",
  },
}));

function onSignIn(e, history, pass, em) {
  e.preventDefault();
  const password = pass;
  const email = em;
  // Post request to backend
  axios
    .post(
      "http://localhost:3001/users/signin",
      {
        username: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    )
    .then((json) => {
      // console.log(json.data);
      if (json.data.success) {
        history.push("/Feed");
      } else {
        console.log("SIGN IN FAILED");
        document.getElementById("errorMessage").innerText = json.data.message;
      }
    });
}

export default function Login(props) {
  const { history } = props;
  const classes = useStyles();
  const rootRef = React.useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.bgdImage} ref={rootRef}>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        className={classes.modal}
        container={() => rootRef.current}
      >
        <div className={classes.paper} style={{ padding: 45, marginTop: 167 }}>
          <p id="server-modal-description">
            <Typography align="center" id="server-modal-title">
              <img src={logo} alt="Logo" style={{ width: "100px" }} />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  component="h2"
                  fontsize={18}
                  align="center"
                  id="server-modal-title"
                >
                  Connecting Gamers Worldwide. <p></p>
                  <p id="errorMessage" className={classes.error}></p>
                </Typography>
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <form id="signinForm" className={classes.form} noValidate>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="email"
                    name="email"
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="password"
                    name="password"
                    variant="outlined"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    id="signinButton"
                    className={classes.submit}
                    onClick={(e) => onSignIn(e, history, password, email)}
                  >
                    Sign In
                  </Button>
                </Grid>
              </Grid>
            </form>
          </p>
        </div>
      </Modal>
    </div>
  );
}
