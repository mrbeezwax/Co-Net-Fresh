/*
* Schema: User
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameTagSchema = new Schema({name: String});


const GameSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter the name of the game!"]
    },
    numberOfPlayersSearching:{
        type: Number, //this will be outputted and mutated based on the number of players that are looking to queue for this game
        default: 0
    },
    gameTags: [GameTagSchema]

    //need to add game image
});

module.exports = mongoose.model('Game', GameSchema);