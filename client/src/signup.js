import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import TextField from "@mui/material/TextField";
import mainStyles from "./main.module.css";
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
  },
  paper: {
    width: 400,
    backgroundColor: useTheme().palette.background.paper,
    border: "0.5px solid #a9a9a9",
    borderRadius: 10,
    boxShadow: useTheme().shadows[5],
    padding: useTheme().spacing(2, 4, 3),
    marginBottom: 200,
    marginRight: 400,
    marginTop: 100,
    overflow: "visible",
  },
  error: {
    backgroundColor: "#FFCCCC",
  },
}));

/**
 * onSignup takes in the fields on the form, checks if password matches with confirmPassword, and then
 * calls signUp() on backend. If there are issues, there will be error messages displayed on the form. If there
 * are no issues, the user will be signed in
 */
function onSignUp(e, history, fn, ln, em, cEm, pass, cPass, uname) {
  e.preventDefault();
  const email = em;
  const confirmEmail = cEm;
  const password = pass;
  const firstName = fn;
  const lastName = ln;
  const username = uname;
  const confirmPassword = cPass;

  if (password !== confirmPassword) {
    //Error catching.
    document.getElementById("errorMessage").innerText =
      "Password did not match. Please make sure you enter the same password.";
  } else if (email !== confirmEmail) {
    document.getElementById("errorMessage").innerText =
      "Email did not match. Please make sure you enter the same email.";
  } else if (username === "Guest" || username === "guest") {
    document.getElementById("errorMessage").innerText =
      "Username is not allowed. Please use a different username.";
  } else {
    axios
      .post(`http://localhost:3001/users/signup`, {
        username: username,
        firstName: firstName,
        lastName: lastName,
        emailAddress: email,
        password: password,
      })
      .then((json) => {
        console.log(json);
        if (json.data.success) {
          axios
            .post(
              `http://localhost:3001/users/signin`,
              {
                username: email,
                password: password,
              },
              {
                withCredentials: true,
              }
            )
            .then((json) => {
              if (json.data.success) {
                history.push("/feed");
              } else {
                document.getElementById("errorMessage").innerText =
                  "Sign in failed. Please use the login button to try signing in with your new account.";
              }
            });
        } //Error catching.
        else {
          if (
            json.data.message ===
            "Error: Account already exists with that username."
          ) {
            document.getElementById("errorMessage").innerText =
              "Username already in use. Please try a different username.";
          } else if (
            json.data.message ===
            "Error: Account already exists with that email."
          ) {
            document.getElementById("errorMessage").innerText =
              "Email already in use. Please use a different email.";
          } else if (json.data.message === "MISSING INPUTS") {
            document.getElementById("errorMessage").innerText =
              "Please fill out all areas on the form before submitting.";
          } else if (json.data.message === "ILLEGAL USERNAME") {
            document.getElementById("errorMessage").innerText =
              "Username cannot contain any special characers";
          } else if (json.data.message === "SHORT PASSWORD") {
            document.getElementById("errorMessage").innerText =
              "Password must contain 8 or more characters.";
          } else {
            document.getElementById("errorMessage").innerText =
              "Server error. Please try again later.";
          }
        }
      });
  }
}

export default function Login(props) {
  const { history } = props;
  const classes = useStyles();
  const rootRef = React.useRef(null);
  const [username, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setConfirmPassword] = useState("");

  axios
    .get("http://localhost:3001/user/currentuser", { withCredentials: true })
    .then((json) => {
      if (json.data.username !== "Guest") {
        history.push("/Feed");
      }
    });

  return (
    <div className={mainStyles.bgdImage} ref={rootRef}>
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
        <div className={classes.paper} style={{ marginTop: 200 }}>
          <p id="server-modal-description">
            <Typography align="center" id="server-modal-title"></Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}></Grid>
            </Grid>
            <form className={classes.form} noValidate>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="firstName"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="lname"
                    name="lastName"
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="uname"
                    name="username"
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    autoFocus
                  />
                </Grid>
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
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="cEmail"
                    name="cEmail"
                    variant="outlined"
                    required
                    fullWidth
                    id="cEmail"
                    label="Confirm Email"
                    value={cEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="pass"
                    name="password"
                    variant="outlined"
                    required
                    fullWidth
                    type="password"
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="cPass"
                    name="cPassword"
                    variant="outlined"
                    required
                    fullWidth
                    type="password"
                    id="cPassword"
                    label="Confirm Password"
                    value={cPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary first"
                    id="signupButton"
                    onClick={(e) =>
                      onSignUp(
                        e,
                        history,
                        firstName,
                        lastName,
                        email,
                        cEmail,
                        password,
                        cPassword,
                        username
                      )
                    }
                  >
                    Sign Up
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
