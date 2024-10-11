const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;
const SteamStrategy = require("passport-steam").Strategy;
const UserModel = require("../models/userModel");
const requiredEnvVars = ["JWT_SECRET", "HOSTNAME", "STEAM_API_KEY"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

/**
 * Authenticate a user using JWT strategy. Find a user with the given email
 * address from the JWT payload. If found, return the user object. If not,
 * return false.
 */
passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await UserModel.findOne({ emailAddress: jwtPayload.email });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

/**
 * Authenticate a user using Steam strategy. Find a user with the given
 * steamId from the profile. If found, return the user object. If not,
 * create a new user and return it.
 */
passport.use(
  new SteamStrategy(
    {
      returnURL: `${process.env.HOSTNAME}` + `/auth/steam/return`,
      realm: `${process.env.HOSTNAME}`,
      apiKey: `${process.env.STEAM_API_KEY}`,
    },
    async function (identifier, profile, done) {
      try {
        // identifier is the 64-bit steam id
        let user = await UserModel.findOne({ steamId: identifier });
        if (user) {
          return done(null, user);
        } else {
          // Create a new user with Steam profile information
          user = new UserModel({
            steamId: identifier,
            username: profile.displayName,
            // Add other relevant fields from the Steam profile
          });
          await user.save();
          return done(null, user);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
