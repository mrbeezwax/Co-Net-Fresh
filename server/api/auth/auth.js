const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;
const SteamStrategy = require("passport-steam").Strategy;
const UserModel = require("../models/userModel");

// Login Passport

// Local
// passport.use(
//   new localStrategy(
//     {
//       session: false,
//     },
//     (user, password, done) => {
//       UserModel.findOne(
//         {
//           emailAddress: user,
//         },
//         function (err, user) {
//           if (err) {
//             return done(err);
//           }
//           if (!user) {
//             return done(null, false, {
//               message: "Incorrect email.",
//             });
//           }
//           if (!user.validPassword(password)) {
//             return done(null, false, {
//               message: "Incorrect password.",
//             });
//           }
//           return done(null, user);
//         }
//       );
//     }
//   )
// );

// JWT Passport
// var cookieExtractor = function (req) {
//   var token = null;
//   if (req && req.cookies) token = req.cookies["jwt"];
//   return token;
// };
var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JWTStrategy(opts, function (user, done) {
    UserModel.findOne({ emailAddress: user.email }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

// Steam Strategy WIP
passport.use(
  new SteamStrategy(
    {
      returnURL: `http://localhost:3000/feed`,
      realm: `http://localhost:3000/`,
      apiKey: `${process.env.STEAM_API_KEY}`,
    },
    function (identifier, profile, done) {
      console.log("steam");
      return done(null, profile);
    }
  )
);
