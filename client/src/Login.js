import Modal from "@mui/material/Modal";
import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import logo from "./logo.png";
import bgd from "./background.jpeg";
import axios from "axios";
import styles from "./main.module.css";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles(() => ({
  root: {
    transform: "translateZ(0)",
    height: 768,
    flexGrow: 1,
    backgroundImage: "url(" + bgd + ")",
    backgroundSize: "cover",
    flex: 1,
    resizeMode: "cover",
  },

  modal: {
    display: "flex",
    padding: useTheme().spacing(1),
    alignItems: "center",
    justifyContent: "center",

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

  links: {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
}));

function onSteamLogin(e) {
  e.preventDefault();
  console.log("Steam Clicked");
  axios.get("http://localhost:3000/auth/steam").then((json) => {
    console.log("steam login json");
    console.log(json);
  });
}

export default function Login(props) {
  const { history } = props;
  const classes = useStyles();
  const rootRef = React.useRef(null);

  axios
    .get("http://localhost:3001/user/currentuser", { withCredentials: true })
    .then((json) => {
      if (json.data.username !== "Guest") {
        history.push("/Feed");
      }
    });

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
        <div className={classes.paper} style={{ marginTop: 167 }}>
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
                  Connecting Gamers Worldwide.
                </Typography>
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <div>
              <form className={classes.form} noValidate>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={() => history.push("/signup")}
                    >
                      Sign up with Email
                    </Button>
                  </Grid>
                  <Grid item xs={12}></Grid>
                </Grid>
                <Grid container spacing={10}>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <Typography
                      display="inline"
                      component="h2"
                      fontsize={18}
                      align="center"
                      id="server-modal-title"
                    >
                      Already have an account?
                    </Typography>
                    <Typography
                      className={classes.links}
                      display="inline"
                      color="primary"
                      component="h2"
                      fontsize={18}
                      align="center"
                      onClick={() => history.push("/signin")}
                      id="server-modal-title"
                    >
                      {" "}
                      Sign in.{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </div>
          </p>
        </div>
      </Modal>
    </div>
  );
}
