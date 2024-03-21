import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Games from "./Games.js";
import ReviewTab from "./reviewTab.js";
import FriendsList from "./friendsList.js";
import Activity from "./Activity.js";
import { useTheme } from "@mui/material/styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: useTheme().palette.background.paper,
    shadows: ["none"],
  },
}));

export default function ScrollableTabsButtonForce(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ marginTop: 20 }} className={classes.root}>
      <AppBar elevation={0} position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Games" {...a11yProps(0)} />
          <Tab label="Activity" {...a11yProps(1)} />
          <Tab label="Following" {...a11yProps(2)} />
          <Tab label="Reviews" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Games
          title={`${props.username}'s Game Library`}
          username={props.username}
          isCurrentUser={props.currentUser}
          allActiveGames={props.allActiveGames}
        ></Games>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Activity
          title={`${props.username}'s Activity`}
          allActivity={props.allActivity}
        ></Activity>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <FriendsList
          title={`Who ${props.username} is Following`}
          allFollowers={props.allFollowers}
        ></FriendsList>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ReviewTab
          title="User Reputation"
          allRep={props.allRep}
          timeZone={props.timeZone}
        ></ReviewTab>
      </TabPanel>
    </div>
  );
}
