import React, { Fragment, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logo from "./logo.png";
import MailIcon from "@mui/icons-material/Mail";
import { makeStyles } from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import MoreIcon from "@mui/icons-material/MoreVert";
import PartyButton from "./Party";
import PartyActive from "./PartyActive";
import socketIOClient from "socket.io-client";
import algoliasearch from "algoliasearch/lite";
import Tags from "./lib/Tags";
import "./tags.css";
import { InstantSearch, Index } from "react-instantsearch-dom";
import styles from "./main.module.css";
import { useTheme } from "@mui/material/styles";

const TagSelectedComponent = ({ hit }) => (
  <Fragment>
    <code>{hit.username}</code>
  </Fragment>
);

const TagSuggestionComponent = ({ hit }) => <Fragment>{hit.username}</Fragment>;

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: useTheme().spacing(2),
  },
  title: {
    display: "none",
    [useTheme().breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: useTheme().shape.borderRadius,
    // backgroundColor: fade(theme.palette.common.black, 0.15),
    // "&:hover": {
    //   backgroundColor: fade(theme.palette.common.black, 0.25),
    // },
    marginRight: useTheme().spacing(2),
    marginLeft: 0,
    width: "400px !important",
    [useTheme().breakpoints.up("sm")]: {
      marginLeft: useTheme().spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    width: useTheme().spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "secondary",
  },
  inputInput: {
    padding: useTheme().spacing(1, 1, 1, 7),
    transition: useTheme().transitions.create("width"),
    width: "100%",
    [useTheme().breakpoints.up("md")]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: "none",
    [useTheme().breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [useTheme().breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function PrimarySearchAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [username, setUsername] = useState("Guest");
  const [isGuest, setIsGuest] = useState(false);
  const [isInParty, setIsInParty] = useState(false);
  const [partyID, setPartyID] = useState("");
  const [render, setRender] = useState(false);

  const client = algoliasearch(
    process.env.REACT_APP_ALGOLIA_APP_ID,
    process.env.REACT_APP_ALGOLIA_SEARCH_KEY
  );

  const { history } = props;

  const onAddTag = (hit) => {
    return hit;
  };

  const onTagsUpdated = (actualTags, previousTags) => {
    if (actualTags.length == 0) return;
    history.push(`/profile/${actualTags[0].username}`);
    window.location.reload(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (event) => {
    setAnchorEl(null);
    handleMobileMenuClose();
    if (event === "profile") history.push("/profile");
    else if (event === "logout") {
      axios
        .get("http://localhost:3001/users/logout", { withCredentials: true })
        .then((json) => {
          if (json.data.loggedOut) {
            axios
              .put(`http://localhost:3001/users/${username}`, {
                status: "Offline",
              })
              .then((json) => {
                history.push("");
              });
          }
        });
    } else if (event === "myaccount") history.push("/myaccount");
    else if (event === "messages") history.push("/messages");
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    // console.log(render);
    axios
      .get("http://localhost:3001/user/currentuser", { withCredentials: true })
      .then((json) => {
        if (json.data.username === "Guest") {
          setIsGuest(true);
        } else {
          // If logged in, set username and guest to false
          var status = json.data.status;
          var inParty = false;
          if (json.data.currentPartyId) {
            setIsInParty(true);
            setPartyID(json.data.currentPartyId);
            inParty = true;
          }
          setUsername(json.data.username);
          setIsGuest(false);
          const socket = socketIOClient("http://localhost:3001");
          socket.on("connected", () => {
            socket.emit("login", json.data.username, inParty, status);
          });
        }
      });
  }, []);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleMenuClose("profile")}>Profile</MenuItem>
      <MenuItem onClick={() => handleMenuClose("myaccount")}>
        My account
      </MenuItem>
      <MenuItem onClick={() => handleMenuClose("messages")}>Messages</MenuItem>

      <MenuItem id="logout" onClick={() => handleMenuClose("logout")}>
        Logout
      </MenuItem>
    </Menu>
  );

  function Hit(props) {
    console.log("hit");
    console.log(props.hit.username);
    return <div>{props.hit.username}</div>;
  }

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <Typography>{username}</Typography>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return isGuest ? (
    <div id="TopMenu" className="hi" style={{ margin: 0 }}>
      <AppBar
        style={{ margin: 0, padding: 10 }}
        color="transparent"
        position="static"
      >
        <Toolbar>
          <a
            onClick={() => history.push("/Feed")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="Logo" style={{ width: "70px" }} />
          </a>

          <IconButton color="inherit">
            <Typography
              className="menuButtons"
              onClick={() => history.push("/Feed")}
            >
              Browse
            </Typography>
          </IconButton>

          <IconButton color="inherit">
            <Typography
              className="menuButtons"
              onClick={() => history.push("/Forum")}
            >
              Forum
            </Typography>
          </IconButton>

          <div className={classes.search}>
            {/* <div className={classes.searchIcon}>
              <SearchIcon />
            </div> */}
            <InstantSearch
              className={styles.searchWidth}
              searchClient={client}
              indexName="co-net_users"
            >
              <Index indexName="co-net_users">
                <Tags
                  search={true}
                  selectedTagComponent={TagSelectedComponent}
                  suggestedTagComponent={TagSuggestionComponent}
                  onAddTag={onAddTag}
                  onUpdate={onTagsUpdated}
                  limitedTo={1}
                  translations={{
                    placeholder: "Search",
                  }}
                />
              </Index>
            </InstantSearch>
            {/* <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            /> */}
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit">
              <Typography
                className="menuButtons"
                onClick={() => history.push("/signin")}
              >
                Sign In
              </Typography>
            </IconButton>
            <IconButton color="inherit">
              <Typography
                className="menuButtons"
                onClick={() => history.push("/signup")}
                style={{ color: "#af0303" }}
              >
                Sign Up
              </Typography>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton color="inherit">
              <Typography
                className="menuButtons"
                onClick={() => history.push("/signin")}
              >
                Sign In
              </Typography>
            </IconButton>
            <IconButton color="inherit">
              <Typography
                className="menuButtons"
                onClick={() => history.push("/signup")}
              >
                Sign Up
              </Typography>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  ) : (
    <div id="TopMenu" className="hi" style={{ margin: 0 }}>
      <AppBar
        style={{ margin: 0, padding: 10 }}
        color="transparent"
        position="static"
      >
        <Toolbar>
          <a
            onClick={() => history.push("/Feed")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="Logo" style={{ width: "70px" }} />
          </a>

          <IconButton color="inherit">
            <Typography
              className="menuButtons"
              onClick={() => history.push("/Feed")}
            >
              Browse
            </Typography>
          </IconButton>

          <IconButton color="inherit">
            <Typography
              className="menuButtons"
              onClick={() => history.push("/Forum")}
            >
              Forum
            </Typography>
          </IconButton>

          <div className={classes.search}>
            {/* <div className={classes.searchIcon}>
              <SearchIcon />
            </div> */}
            <InstantSearch searchClient={client} indexName="co-net_users">
              <Index indexName="co-net_users">
                <Tags
                  search={true}
                  selectedTagComponent={TagSelectedComponent}
                  suggestedTagComponent={TagSuggestionComponent}
                  onAddTag={onAddTag}
                  onUpdate={onTagsUpdated}
                  limitedTo={1}
                  translations={{
                    placeholder: "Search",
                  }}
                />
              </Index>
            </InstantSearch>
            {/* <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            /> */}
          </div>

          <IconButton id="partyButton" color="inherit">
            {isInParty ? (
              <PartyActive
                username={username}
                partyID={partyID}
                history={history}
              ></PartyActive>
            ) : (
              <PartyButton username={username} history={history}></PartyButton>
            )}
          </IconButton>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              id="usermenu"
            >
              <Typography className="userName">{username}</Typography>
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
