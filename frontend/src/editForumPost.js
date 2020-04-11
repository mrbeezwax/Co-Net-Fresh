/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ReactDOM from 'react-dom'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import TopMenu from './TopMenu';
import axios from 'axios';
import { createMuiTheme } from "@material-ui/core/styles";
import styles from './App.css';
import leaguePhoto from './leaguePhoto.jpg'
import Brightness1Icon from '@material-ui/icons/Brightness1';
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import mainStyles from './main.module.css';
import Divider from '@material-ui/core/Divider';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AutoGame from './autoGame';
import CreatableSelect from 'react-select/creatable';
import Select from '@material-ui/core/Select';
import CheckIcon from '@material-ui/icons/Check';




class editForumPost extends Component
{
  constructor(props) {
    super(props);

    this.pushHistory = this.pushHistory.bind(this);


    this.state = {
      allPosts: [
        {
          dateTime: "loading",
          description: "temp",
          photo: "temp",
          tags: [],
          title: "loading",
          username: "temp"
        }
      ],
    }
    
  }

  

  pushHistory(){
    this.props.history.push('/forumPost')
  
   }

  
  componentDidMount() {
    // Retreive user data
    axios
      .get("http://localhost:6969/user/currentuser", { withCredentials: true })
      .then(json => {
        if (!json.data.username) {
          this.props.history.push("/signModal");
        } else {
          axios.get("http://localhost:6969/posts/")
          .then(json => {
            this.setState({ allPosts: json.data.postObj});
          })
        }
      });
  }
  

  render()
  {
    const {allPosts} = this.state;
    const theme = createMuiTheme({
      '@global' : {
        body: {
          backgroundColor: "white",
        }
      }
    });

    const paperStyle = {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }

    const avatarStyle = {
      margin: 1,
      backgroundColor: "gray",
    }

    const formStyle = {
      width: '100%', // Fix IE 11 issue.
      marginTop: 3,
    }

    const submitStyle = {
      marginTop: 3,
      marginBottom: 0,
      marginRight: 2,
    }

    const tileStyle = {
  
    }
  
    const gridStyle = {
      marginTop: 20,
  
    }

    const titleStyle = {
      marginTop: 20,
      color: "#535353",
    }

    const gameTitle = {
      color: "black",
      marginTop: 20,
      marginLeft: 8,

    }
    const gameDesc = {
      color: "#535353",
      marginTop: 5,
      marginLeft: 8,

    }

    const gameList = ['League of Legends', 'Counter Strike', 'Fortnite', 'Portal', 'Minecraft']
    

    const dividerGridStyle = {
        root: {
            width: 'fit-content',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
            '& svg': {
              margin: theme.spacing(1.5),
            },
            '& hr': {
              margin: theme.spacing(0, 0.5),
            },
          },
    }
    
  
  /*const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };*/


    return (
      
 <div>
 <TopMenu history={this.props.history}></TopMenu>
   <div className = "content">
      <Grid container spacing={3}>
      <Grid item xs={6}>
      <Typography style = {titleStyle} align = 'Left' variant="h4" component="h2" >
      Edit Forum Post</Typography>
      </Grid>
     
    </Grid>
    <TextField
    id="outlined-full-width"
    label="Title"
    defaultValue="Looking for Duo in Ranked, I'm Gold"
    margin="normal"
    InputLabelProps={{
      shrink: true,
    }}
    className = {mainStyles.titleInput}
    variant="outlined"
  />
 
    <AutoGame></AutoGame>
    <div style = {{marginRight: 20,}}>
    <TextField
    id="outlined-multiline-static"
    label="What's your post about?"
    multiline
    rows="10"
    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget rhoncus nunc, eget tempor purus."
    variant="outlined"
    className = {mainStyles.bodyInput}
  ></TextField>
  <div className = {mainStyles.buttonMargins}>
  <Button     onClick = {this.pushHistory}
   className = {mainStyles.cancelButton} variant = "contained" >Cancel</Button>

  <Button     onClick = {this.pushHistory}
   className = {mainStyles.postButton} color = "primary" variant = "contained" ><CheckIcon style = {{marginRight: 6,}}></CheckIcon>Save Changes</Button>
  </div>
  </div>
    </div>
    </div>
  
    );
  }
}

export default editForumPost;