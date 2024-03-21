import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logo from "./logo.png";
import MailIcon from "@mui/icons-material/Mail";
import { fade, makeStyles } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

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
    backgroundColor: fade(useTheme().palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: fade(useTheme().palette.common.black, 0.25),
    },
    marginRight: useTheme().spacing(2),
    marginLeft: 0,
    width: "100%",
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

  const [username, setUsername] = useState();
  const getUser = () => {
    axios
      .get("http://localhost:3001/user/currentuser", { withCredentials: true })
      .then((json) => {
        if (json.data.username) {
          setUsername(json.data.username);
        }
      });
  };

  const { history } = props;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (event) => {
    setAnchorEl(null);
    handleMobileMenuClose();
    if (event === "profile") history.push("profile");
    if (event === "myaccount") history.push("myaccount");
    if (event === "messages") history.push("messages");
    else if (event === "logout") history.push("");
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    getUser();
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

      <MenuItem onClick={() => handleMenuClose("logout")}>Logout</MenuItem>
    </Menu>
  );

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

  return (
    <div className="hi" style={{ margin: 0 }}>
      <AppBar
        style={{ margin: 0, padding: 10 }}
        color="transparent"
        position="static"
      >
        <Toolbar>
          <a href="http://localhost:3000/Feed">
            <img src={logo} alt="Logo" style={{ width: "70px" }} />
          </a>

          <IconButton color="inherit">
            <Typography
              className="menuButtons"
              onClick={() => history.push("/feed")}
            >
              Browse
            </Typography>
          </IconButton>

          <IconButton color="inherit">
            <Typography
              className="menuButtons"
              onClick={() => history.push("/forum")}
            >
              Forum
            </Typography>
          </IconButton>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>

            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
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
  );
}
