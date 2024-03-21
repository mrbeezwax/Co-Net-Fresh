// client/src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import * as registerServiceWorker from "./serviceWorker";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
]);

// const routing = (
//   <Router history={history}>
//     <div>
//       <Routes>
//         <Route exact path="/" component={Login} />
//         <Route path="/Feed" component={Feed} />
//         <Route path="/signup" component={signup} />
//         <Route path="/pic" component={PicUpload} />
//         <Route path="/testlogout" component={testLogout} />
//         <Route path="/signin" component={signin} />
//         <Route
//           exact
//           path="/Profile"
//           render={(props) => <Profile {...props} ownProfile={true} />}
//         />
//         <Route
//           exact
//           path="/Profile/:username"
//           render={(props) => <Profile {...props} ownProfile={false} />}
//         />
//         <Route path="/Forum" component={Forum} />
//         <Route
//           exact
//           path="/forumPost/:postID"
//           render={(props) => <ForumPost {...props} />}
//         />
//         <Route path="/createForumPost" component={CreateForumPost} />
//         <Route path="/editForumPost" component={editForumPost} />
//         <Route path="/myaccount" component={AccountSettings} />
//         <Route path="/messages" component={Messages} />
//         <Route path="/createmessage" component={CreateMessage} />

//         <Route
//           exact
//           path="/game/:gameID"
//           render={(props) => <Game {...props} />}
//         />
//       </Routes>
//     </div>
//   </Router>
// );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
registerServiceWorker.unregister();
reportWebVitals();
