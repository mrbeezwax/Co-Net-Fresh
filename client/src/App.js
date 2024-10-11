import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import SignIn from "./signin";
import Feed from "./Feed";
import Profile from "./Profile";
import Forum from "./Forum";
import ForumPost from "./forumPost";
import CreateForumPost from "./createForumPost";
import EditForumPost from "./editForumPost";
import AccountSettings from "./AccountSettings";
import Messages from "./messages";
import CreateMessage from "./CreateMessage";
import Game from "./game";
import AuthSuccess from "./AuthSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/Feed" element={<Feed />} />
        <Route path="/Profile" element={<Profile ownProfile={true} />} />
        <Route
          path="/Profile/:username"
          element={<Profile ownProfile={false} />}
        />
        <Route path="/Forum" element={<Forum />} />
        <Route path="/forumPost/:postID" element={<ForumPost />} />
        <Route path="/createForumPost" element={<CreateForumPost />} />
        <Route path="/editForumPost" element={<EditForumPost />} />
        <Route path="/myaccount" element={<AccountSettings />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/createmessage" element={<CreateMessage />} />
        <Route path="/game/:gameID" element={<Game />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
