const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;
const SteamStrategy = require("passport-steam").Strategy;
const UserModel = require("../models/userModel");

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

/**
 * Authenticate a user using JWT strategy. Find a user with the given email
 * address from the JWT payload. If found, return the user object. If not,
 * return false.
 */
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

/**
 * Authenticate a user using Steam strategy. Find a user with the given
 * steamId from the profile. If found, return the user object. If not,
 * return false.
 */
passport.use(
  new SteamStrategy(
    {
      returnURL: `${process.env.HOSTNAME}` + `/feed`,
      realm: `${process.env.HOSTNAME}`,
      apiKey: `${process.env.STEAM_API_KEY}`,
    },
    function (identifier, profile, done) {
      // identifier is the 64-bit steam id
      UserModel.findOne({ steamId: identifier }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);
