/*
 * Schema: User
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAlgolia = require("mongoose-algolia");

const UserTagSchema = new Schema({ name: String }); // need to add schema for postID
const UsersGamesSchema = new Schema({
  name: String,
  url: String,
  gameTags: [String],
  gameID: String,
});
const FriendSchema = new Schema({ username: String });
const PostIDSchema = new Schema({ postID: String });
const MessageThreadIDSchema = new Schema({ threadID: String });
const VotedPostSchema = new Schema({
  type: String,
  postID: String,
});
const PlayerRepSchema = new Schema({
  username: String,
  rep: String,
  comment: String,
  avatar: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
  },
  emailAddress: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  timeZone: {
    type: String,
    default: "America/Los_Angeles",
  },
  status: {
    type: String,
    default: "Offline",
  },
  currentPartyId: {
    type: String,
    default: "",
  },
  steamId: {
    type: String,
    default: "",
  },
  userTags: [UserTagSchema],
  friends: [FriendSchema],
  games: [UsersGamesSchema],
  currentSearchingGames: [UsersGamesSchema],
  forumPosts: [PostIDSchema],
  playerRep: [PlayerRepSchema],
  allMessageThreads: [MessageThreadIDSchema],
  votedPosts: [VotedPostSchema],
});

// UserSchema.plugin(mongooseAlgolia, {
//   appId: "T7MES4D4M7",
//   apiKey: "527cf23a995edb665d518b0cdf72b7b9",
//   indexName: "co-net_users",
// });

const UserModel = mongoose.model("User", UserSchema);
// UserModel.SyncToAlgolia().then(console.log("Users synced with Algolia"));
// UserModel.SetAlgoliaSettings({
//   searchableAttributes: ["username"],
// });

module.exports = UserModel;
