import React from "react";
import { makeStyles } from "@mui/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import mainStyles from "./main.module.css";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles(() => ({
  selectEmpty: {
    marginTop: useTheme().spacing(2),
  },
}));

export default function SimpleSelect(props) {
  const classes = useStyles();
  const [game, setGame] = React.useState("");

  // Retrieve list of games
  // axios.get("http://localhost:3001/games")
  // .then((json) => {
  //   let gamesArr = json.data.gameObj;
  //   let gameNamesCmps = [];
  //   let key = 1;
  //   gamesArr.forEach((game) => {
  //     const cmp = <MenuItem key={key} value={game.name}>{game.name}</MenuItem>
  //     gameNamesCmps.push(cmp);
  //   });
  //   setGameCmps(gameNamesCmps);
  // });

  const handleGameSelect = (event) => {
    setGame(event.target.value);
    props.onGameSelect(event);
  };

  // let itemsToRender = 20;

  // When user scrolls to bottom, load more
  // function loadMore(event) {
  //   if (event.target.scrollTop == event.target.scrollHeight) {
  //     itemsToRender += 10;
  //     console.log(itemsToRender);
  //   }
  // }

  // var menuItems = [];

  // if (props.isLoading) {
  //   menuItems.push((
  //   <MenuItem value="">
  //           <em>Loading...</em>
  //   </MenuItem>
  //   ));
  // } else {
  //   console.log("Rendering list");
  //   for (let i = 0; i < itemsToRender; i++) {
  //     menuItems.push(props.gameCmps[i]);
  //   }
  // }
  return (
    <div>
      <FormControl variant="outlined" className={mainStyles.autoGame}>
        <InputLabel id="demo-simple-select-outlined-label">
          Game Name
        </InputLabel>
        <Select
          // menuProps={{onScroll: loadMore}}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={game}
          onChange={handleGameSelect}
          label="Game"
          // style={{maxHeight: "10px"}}
        >
          {/* {menuItems} */}
          <MenuItem value={"League of Legends"}>League of Legends</MenuItem>
          <MenuItem value={"Minecraft"}>Minecraft</MenuItem>
          <MenuItem value={"Fortnite"}>Fortnite</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
