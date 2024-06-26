import React, { Component } from "react";
import axios from "axios";
import { Multiselect } from "multiselect-react-dropdown";
import * as fuzz from "fuzzball";

class TestLogout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plainArray: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
      objectArray: [
        { key: "Option 1" },
        { key: "Option 2" },
        { key: "Option 3" },
        { key: "Option 4" },
        { key: "Option 5" },
        { key: "Option 6" },
        { key: "Option 7" },
      ],
      selectedValues: [{ key: "Option 1" }, { key: "Option 2" }],
    };
  }

  render() {
    const { selectedValues, objectArray } = this.state;
    return (
      <div>
        <h4>3. Multiselect with preselect values</h4>
        <Multiselect
          options={objectArray}
          displayValue="key"
          selectedValues={selectedValues}
        />
        <button type="button" onClick={suggestGame}>
          Suggest a Game
        </button>
        <button type="button" onClick={getCurrentUser}>
          Get Current User
        </button>
        <button type="button" onClick={loginUser}>
          Sign In
        </button>
        <button type="button" onClick={logoutUser}>
          Log Out
        </button>
      </div>
    );
  }
}

function suggestGame() {
  // DATA ANALYSIS
  const tags1 = ["FPS", "Casual", "Multiplayer"];
  const tags2 = ["Pixel", "Fun", "Casual", "Fps"];
  const tags3 = ["Music", "Realistic", "Beautiful"];
  const tags4 = ["Casual", "FPS", "Pixel", "Multiplayer"];

  let score1 = fuzz.token_set_ratio(tags1.join(" "), tags2.join(" "));
  let score2 = fuzz.token_set_ratio(tags1.join(" "), tags3.join(" "));
  let score3 = fuzz.token_set_ratio(tags1.join(" "), tags4.join(" "));
  let score4 = fuzz.token_set_ratio(tags2.join(" "), tags4.join(" "));
  console.log(`Score 1: ${score1}`);
  console.log(`Score 2: ${score2}`);
  console.log(`Score 3: ${score3}`);
  console.log(`Score 4: ${score4}`);
}

function loginUser() {
  axios
    .post(
      "http://localhost:3001/users/signin",
      {
        username: "conettwoboi@gmail.com",
        password: "password2",
      },
      { withCredentials: true }
    )
    .then((json) => {
      if (json.data.success) alert("Signed in");
    });
}

function logoutUser() {
  axios
    .get("http://localhost:3001/users/logout", { withCredentials: true })
    .then((json) => {
      if (json.data.loggedOut) {
        alert("Logged out");
      }
    });
}

function getCurrentUser() {
  // Post request to backend
  axios
    .get("http://localhost:3001/user/currentuser", { withCredentials: true })
    .then((json) => {
      if (json.data.username) {
        console.log("SUCCESS");
        alert(json.data.username + " - " + json.data.email);
      } else {
        alert("Not Logged In");
        console.log("FAIL");
      }
    });
}

export default TestLogout;
