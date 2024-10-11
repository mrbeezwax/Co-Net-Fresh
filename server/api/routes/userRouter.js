/*
 * Parent Route: /users
 */
const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const sanitize = require("sanitize");
const bcrypt = require("bcryptjs");

router.get(
  "/auth/steam",
  (req, res, next) => {
    console.log("Initiating Steam authentication");
    next();
  },
  passport.authenticate("steam", { failureRedirect: "/" })
);

router.get(
  "/auth/steam/return",
  (req, res, next) => {
    console.log("Received Steam authentication callback");
    next();
  },
  passport.authenticate("steam", { failureRedirect: "/" }),
  async function (req, res) {
    console.log("Steam authentication successful", { user: req.user });

    try {
      // Find or create user based on Steam ID
      let user = await UserModel.findOne({ steamId: req.user.id });
      if (!user) {
        user = new UserModel({
          steamId: req.user.id,
          username: req.user.displayName,
          profilePhoto: req.user.photos[2].value,
        });
        await user.save();
        console.log("New user created from Steam authentication", user);
      } else {
        console.log("Existing user logged in via Steam", user);
      }

      // Generate JWT token
      const payload = {
        id: user.id,
        username: user.username,
        steamId: user.steamId,
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            console.error("Error signing token", err);
            return res.redirect("/login?error=token_error");
          }
          // Redirect to the client-side route with the token
          res.redirect(`/auth-success?token=${token}`);
        }
      );
    } catch (error) {
      console.error("Error in Steam authentication", error);
      res.redirect("/login?error=auth_error");
    }
  }
);

router.get(
  "/currentuser",
  passport.authenticate("jwt", { failureRedirect: "/" }),
  (req, res) => {
    if (req.user === undefined) {
      return res.json({
        username: "Guest",
      });
    } else {
      return res.json({
        username: req.user.username,
        email: req.user.emailAddress,
        bio: req.user.bio,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        profilePhoto: req.user.profilePhoto,
        timeZone: req.user.timeZone,
        userTags: req.user.userTags,
        playerRep: req.user.playerRep,
        votedPosts: req.user.votedPosts,
        friends: req.user.friends,
        status: req.user.status,
        forumPosts: req.user.forumPosts,
        currentPartyId: req.user.currentPartyId,
        games: req.user.games,
        steamId: req.user.steamId,
      });
    }
  }
);

// Create a user
router.post(
  "/signup",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { firstName, lastName, password } = req.body;

    let { emailAddress, username } = req.body;

    // Input validation
    if (!username || !firstName || !lastName || !emailAddress || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Validate username
    if (username === "Guest" || username === "guest") {
      return res.status(400).json({
        message: "Username cannot be 'Guest' or 'guest'",
      });
    }

    // Sanitize username
    username = sanitize(username);

    // Validate username format
    // eslint-disable-next-line no-useless-escape
    const format = /[ !@#$%^&*()+\-.=\[\]{};':"\\|,<>\/?]/;
    if (format.test(username)) {
      return res.status(400).json({
        message: "Username contains invalid characters",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Validate email address
    emailAddress = emailAddress.toLowerCase().trim();

    // Check for duplicate username
    let userCount = await UserModel.countDocuments({ username });
    if (userCount > 0) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Check for duplicate email
    userCount = await UserModel.countDocuments({ emailAddress });
    if (userCount > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = await UserModel.create({
      username,
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    });

    res.json({
      message: "User created successfully",
      user,
    });
  }
);

// Log out by deleting cookie
router.get("/logout", function (req, res) {
  res.cookie("jwt", "", {
    expires: new Date(0),
  });
  return res.send({
    loggedOut: true,
  });
});

// Get a blank user (used for failure redirect)
router.get("/guest", function (req, res) {
  return res.json({
    username: "Guest",
  });
});

//Get a user
router.get("/:username", function (req, res) {
  var queryUsername = req.params.username;
  UserModel.findOne(
    {
      username: queryUsername,
    },
    function (err, obj) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.send(obj);
    }
  );
});

router.delete("/:username", function (req, res) {
  var queryUsername = req.params.username;
  UserModel.findOneAndDelete(
    {
      username: queryUsername,
    },
    function (err, obj) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.send(obj);
    }
  );
});

// Sign in Route using Passport JWT Strategy
router.post(
  "/signin",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    const payload = {
      id: req.user.id,
      username: req.user.username,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Error signing token", err });
        }
        return res.json({
          success: true,
          token: "Bearer " + token,
        });
      }
    );
  }
);

//edit a user
router.put("/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    body,
    {
      new: true,
    },
    function (err, doc) {
      if (err) {
        if (err.code == 11000) {
          return res.json({
            success: false,
            error: err,
            message: "Username already exists",
          });
        }
      }
      return res.json({
        success: true,
        user: doc,
      });
    }
  );
});

// Get all users
router.get("/", function (req, res) {
  UserModel.find((err, user) => {
    if (err)
      return res.json({
        success: false,
        error: err,
      });
    return res.json({
      success: true,
      userObj: user,
    });
  });
});

// Update a user's photo
// router.put("/photo/:username", function (req, res) {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     var queryUsername = req.params.username;
//     UserModel.findOne(
//       {
//         username: queryUsername,
//       },
//       function (err, obj) {
//         var body = obj;
//         cloudinary.uploader.upload(
//           req.file.path,
//           function (result) {
//             body.profilePhoto = result.url;
//             UserModel.findOneAndUpdate(
//               {
//                 username: queryUsername,
//               },
//               body,
//               function (err) {
//                 if (err)
//                   return res.json({
//                     success: false,
//                     error: err,
//                   });
//                 // Remove temp file
//                 fs.unlink(req.file.path, (err) => {
//                   if (err) {
//                     console.log(err);
//                     return res.json({
//                       success: false,
//                     });
//                   }
//                 });
//                 return res.json({
//                   success: true,
//                   user: body,
//                 });
//               }
//             );
//           },
//           {
//             folder: "user_photos",
//           }
//         );
//       }
//     );
//   });
// });

// Temp?
// Get a user's photo url
router.get("/photo/:username", function (req, res) {
  var queryUsername = req.params.username;
  UserModel.findOne(
    {
      username: queryUsername,
    },
    (err, user) => {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      if (user) {
        return res.json({
          success: true,
          profilePhoto: user.profilePhoto,
        });
      }
      return res.json({
        success: false,
        message: "User does not exist",
        profilePhoto:
          "https://res.cloudinary.com/co-net-pix/image/upload/v1586238488/default_user_avatar.jpg",
      });
    }
  );
});

//add a tag to a user
router.put("/addTag/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var tag = body.name;
  var tagObj = {
    name: tag,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $push: {
        userTags: tagObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

// Remove a tag from user
router.put("/removeUserTag/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var tag = body.name;
  var tagObj = {
    name: tag,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $pull: {
        userTags: tagObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

//add a a freind to users friend list
router.put("/addFriend/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var friend = body.username;
  var friendObj = {
    username: friend,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $push: {
        friends: friendObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

// remove a friend from friends list
router.put("/removeFriend/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var friend = body.username;
  var friendObj = {
    username: friend,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $pull: {
        friends: friendObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

// Update game list
router.put("/updateGames/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  if (!body.gameList) {
    return res.json({
      success: false,
      message: "MISSING GAME LIST",
    });
  }
  const games = body.gameList; // Array of games to insert into user game library
  UserModel.findOne(
    {
      username: queryUsername,
    },
    function (err, obj) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      // Get user's game library
      var library = obj.games;
      games.forEach((game) => {
        // If library doesn't contain game already, add to library
        if (library.length === 0) {
          library.push(game);
        } else if (library.some((x) => x.gameID === game.gameID)) {
          return;
        } else {
          library.push(game);
        }
      });
      // Then update user's library
      UserModel.findOneAndUpdate(
        {
          username: queryUsername,
        },
        {
          games: library,
        },
        function (err) {
          if (err)
            return res.json({
              success: false,
              error: err,
            });
          return res.json({
            success: true,
            library: library,
          });
        }
      );
    }
  );
});

//add a game to game list
router.put("/addGame/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var game = body.name;
  var gameObj = {
    name: game,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $push: {
        games: gameObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

//remove game from user game list
router.put("/removeGame/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var game = body.name;
  var gameObj = {
    name: game,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $pull: {
        games: gameObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

//add a game to game list
router.put("/addCurrentSearchingGame/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var game = body.name;
  var gameObj = {
    name: game,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $push: {
        currentSearchingGames: gameObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

//remove game from user current game list
router.put("/removeCurrentSearchingGame/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var game = body.name;
  var gameObj = {
    name: game,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $pull: {
        currentSearchingGames: gameObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

//add a forum post ID to their list of posts
router.put("/addPost/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var post = body.postID;
  var postobj = {
    postID: post,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $push: {
        forumPosts: postobj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

//remove a forum post ID to their list of posts
router.put("/removePost/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var post = body.postID;
  var postobj = {
    postID: post,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $pull: {
        forumPosts: postobj,
      },
    },
    {
      new: true,
    },
    function (err, doc) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: doc,
      });
    }
  );
});

//add player reputation
router.put("/addReputation/:username", function (req, res) {
  var queryUsername = req.params.username; // receiver
  var body = req.body;
  var un = body.username; // author
  var rep = body.reputation;
  var comment = body.comment;
  var avatar = body.avatar;
  var id = body._id;
  var repObj = {
    _id: id,
    username: un,
    rep: rep,
    comment: comment,
    avatar: avatar,
  };

  // Check if feedback already posted by user
  // First get the player rep array of the user
  UserModel.findOne(
    {
      username: queryUsername,
    },
    "playerRep",
    function (err, doc) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      // Check player rep array if user already created review
      const result = doc.playerRep.filter((user) => user.username === un);
      if (result.length > 0) {
        // Add logic to update existing feedback using ID
        UserModel.findOneAndUpdate(
          {
            username: queryUsername,
            "playerRep._id": id,
          },
          {
            $set: {
              "playerRep.$.rep": rep,
              "playerRep.$.comment": comment,
            },
          },
          {
            new: true,
          },
          function (err, doc2) {
            if (err) {
              return res.json({
                success: false,
                error: err,
              });
            }
            return res.json({
              success: true,
              result: "UPDATED",
              message: "Feedback updated successfully",
              feedback: repObj,
              playerRep: doc2.playerRep,
            });
          }
        );
      } else {
        // Else add new feedback
        UserModel.findOneAndUpdate(
          {
            username: queryUsername,
          },
          {
            $push: {
              playerRep: repObj,
            },
          },
          {
            new: true,
          },
          function (err, doc) {
            if (err)
              return res.json({
                success: false,
                result: "ERROR",
                error: err,
              });
            repObj._id = doc.playerRep[doc.playerRep.length - 1]._id;
            return res.json({
              success: true,
              result: "CREATED",
              message: "Feedback created successfully",
              feedback: repObj,
              playerRep: doc.playerRep,
            });
          }
        );
      }
    }
  );
});

// remove all player rep
router.put("/removeAllReputation/:username", function (req, res) {
  var queryUsername = req.params.username;
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      playerRep: [],
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        message: "All rep removed",
      });
    }
  );
});

// remove player reputation
router.put("/removeReputation/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var un = body.username;
  var rep = body.reputation;
  var comment = body.comment;
  var repObj = {
    username: un,
    rep: rep,
    comment: comment,
  };
  UserModel.findOneAndUpdate(
    {
      username: queryUsername,
    },
    {
      $pull: {
        playerRep: repObj,
      },
    },
    function (err) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        user: body,
      });
    }
  );
});

// add a message thread id to a user
// DEPRECATED - process handled in create thread
// router.put('/addMessageThreadID/:username', function (req, res) {
//     var queryUsername = req.params.username;
//     var body = req.body;
//     var messageThreadID = body.messageThreadID;
//     var messageIDobj = {
//         "threadID": messageThreadID
//     };
//     UserModel.findOneAndUpdate({
//         username: queryUsername
//     }, {
//         $push: {
//             allMessageThreads: messageIDobj
//         }
//     }, function (err) {
//         if (err) return res.json({
//             success: false,
//             error: err
//         });
//         return res.json({
//             success: true,
//             user: body
//         });
//     });
// })

// remove a messsage thread from user
// UNUSED
// router.put('/removeThreadID/:username', function (req, res) {
//     var queryUsername = req.params.username;
//     var body = req.body;
//     var messageThreadID = body.messageThreadID;
//     var messageIDobj = {
//         "threadID": messageThreadID
//     };
//     UserModel.findOneAndUpdate({
//         username: queryUsername
//     }, {
//         $pull: {
//             allMessageThreads: messageIDobj
//         }
//     }, function (err) {
//         if (err) return res.json({
//             success: false,
//             error: err
//         });
//         return res.json({
//             success: true,
//             user: body
//         });
//     });
// })

// Get User's Voted Posts and find post with id
router.get("/votedPosts/:username", function (req, res) {
  var queryUsername = req.params.username;
  UserModel.findOne(
    {
      username: queryUsername,
    },
    function (err, obj) {
      if (err)
        return res.json({
          success: false,
          error: err,
        });
      return res.json({
        success: true,
        votedPosts: obj.votedPosts,
      });
    }
  );
});

// Update User's voted Posts
router.put("/votedPosts/:username", function (req, res) {
  var queryUsername = req.params.username;
  var body = req.body;
  var method = body.method;
  var postID = body.postID;
  var type = body.type;
  var voteObj = {
    postID: postID,
    type: type,
  };
  if (!method || !type || !postID) {
    return res.json({
      success: false,
      message: "MISSING FIELDS",
    });
  }
  if (method === "INSERT") {
    UserModel.findOneAndUpdate(
      {
        username: queryUsername,
      },
      {
        $push: {
          votedPosts: voteObj,
        },
      },
      {
        new: true,
      },
      function (err, doc) {
        if (err)
          return res.json({
            success: false,
            error: err,
          });
        return res.json({
          success: true,
          user: doc,
        });
      }
    );
  } else if (method === "DELETE") {
    UserModel.findOneAndUpdate(
      {
        username: queryUsername,
      },
      {
        $pull: {
          votedPosts: voteObj,
        },
      },
      {
        new: true,
      },
      function (err, doc) {
        if (err)
          return res.json({
            success: false,
            error: err,
          });
        return res.json({
          success: true,
          user: doc,
        });
      }
    );
  } else {
    return res.json({
      success: false,
      message: "INVALID METHOD",
    });
  }
});

module.exports = router;
