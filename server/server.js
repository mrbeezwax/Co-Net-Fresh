const mongoose = require("mongoose"),
  express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser"),
  axios = require("axios"),
  passport = require("passport"),
  session = require("express-session");
require("dotenv").config();
require("./api/auth/auth"); // This initializes the passport strategies

const app = express();
const server = require("http").Server(app);

app.use(
  cors({
    credentials: true,
    origin: [
      `http://localhost:3000`,
      "https://steamcommunity.com",
      /\.steampowered\.com$/,
    ],
  })
);
app.use(cookieParser(process.env.JWT_SECRET));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routers
const userRouter = require("./api/routes/userRouter");
const userTagRouter = require("./api/routes/userTagRouter");
const gameRouter = require("./api/routes/gameRouter");
const forumRouter = require("./api/routes/forumPostRouter");
const messageThreadRouter = require("./api/routes/messageThreadRouter");
const partyRouter = require("./api/routes/partyRouter");

// this is our MongoDB database
const dbRoute = `mongodb+srv://${process.env.DB_CREDENTIALS}@conetfresh.7gycna8.mongodb.net/?retryWrites=true&w=majority&appName=CoNetFresh`;

// connects our back end code with the database
mongoose.connect(dbRoute);

let db = mongoose.connection;

db.once("open", () => console.log("Connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(logger("dev"));

// Routes
app.use("/users", userRouter);
app.use("/userTags", userTagRouter);
app.use("/games", gameRouter);
app.use("/forum", forumRouter);
app.use("/messageThread", messageThreadRouter);
app.use("/party", partyRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next(err);
});

// launch our backend into a port
server.listen(process.env.PORT, () =>
  console.log(`CO-NET LISTENING ON PORT ${process.env.PORT}`)
);
