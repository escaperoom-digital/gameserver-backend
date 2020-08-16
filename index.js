/**
 * index.js
 * 
 * @author Fabian Schmitt
 * @version 2020-08-16
 * @description
 * This file is the main file to run the backend server for escaperoom.digital
 * To run, simply execute the command 'node index.js'.
 * 
 * @todo (for the whole backend)
 *  - Add MySQL database integration
 *  - game start/stop/abort
 *  - player leave
 */


const fs = require("fs");
const express = require("express");
const mysql = require("mysql");
const https = require("https");
const colors = require("colors");
const Game = require("./src/game.js");
const Player = require("./src/player.js");
const GameUtils = require("./src/gameUtils.js").GameUtils;
const PlayerUtils = require("./src/playerUtils.js").PlayerUtils;

/** Load config from conf file. */
const config = JSON.parse(fs.readFileSync("settings.json"));

const app = express();
app.use(express.json());


/** Listener for incoming Game Query requests. */
app.get("/game/:gameId*", (req, res) => {
    var gameId = parseInt(req.params.gameId);

    /** Get whether gameId is valid */
    if(isNaN(gameId) || !GameUtils.gameIdExists(gameId)) {
        res.statusCode = 400;
        res.send({"error": "Invalid game id."});
        return;
    }

    /** Get whether request is minimal or not. */
    var minimal = (req.params[0] == "/minimal") ? true : false;

    var game = GameUtils.getGameById(gameId);
    var players = [];
    for(var i = 0; i < game.getCurrentPlayers().length; i++) players.push(game.getCurrentPlayers()[i].getName());
    var data = {"data": {"state": game.getState(), "admin": game.getAdminPlayer().getName, "players": players}};

    res.statusCode = 200;
    res.send(JSON.stringify(data));
});

/** Listener for incoming game manipluation requests. */
app.post("/game/:gameId", (req, res) => {
    var gameId = parseInt(req.params.gameId);
    if(req.body["player"]["name"] == null) {
        res.statusCode = 400;
        res.send(JSON.stringify({"error": "No or invalid player provided."}));
        return;
    }
    var playerJson = req.body["player"];
    let player = new Player.Player();
    player.setName(playerJson["name"]);
    
    if(req.body["operation"] != null) {
        //TODO: Create modify operations (start/abort/leave game)
    } else {
        if(PlayerUtils.playerExists(player)) {
            res.statusCode = 400;
            res.send(JSON.stringify({"error": "Player already exists."}));
            return;
        }
        if(isNaN(gameId) || !GameUtils.gameIdExists(gameId)) {
            game = GameUtils.createNewGame();
            if(game == null) {
                res.statusCode = 400;
                res.send(JSON.stringify({"error": "Game couldn't be created."}));
                return;
            }
            if(isNaN(gameId))
                gameId = game.getGameId();
            else
                game.setGameId(gameId);
            PlayerUtils.joinPlayer(player);
            game.setAdminPlayer(player);
            game.joinPlayer(player);
        } else {
            if(!game.joinPlayer(player) || PlayerUtils.joinPlayer(player)) {
                res.statusCode = 400;
                res.send(JSON.stringify({"error": "Couldn't join " + player.getName() + " to game " + game.getGameId() + "."}));
                return;
            }
        }
    }

    res.send(JSON.stringify({"gameId": game.getGameId(), "playerToken": player.getPlayerToken()}));

    console.log(GameUtils.getGames());
    console.log("\n\n");
});


/** Generate MySQL database connection. */
const mysqlConn = mysql.createConnection({
    host: config.mysql.hostname,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database
});


/** Set values for GameUtils. */
GameUtils.setMaxGames(config.games.max);
GameUtils.setMaxPlayers(config.games.maxPlayers);
GameUtils.setDatabaseConnection(mysqlConn);

/** Set values for PlayerUtils. */
PlayerUtils.setDatabaseConnection(mysqlConn);


/** Start server with(out) SSL encryption. */
if(config.https.enabled) {
    const privateKey = fs.readFileSync(console.https.privateKey, 'utf8');
    const certificate = fs.readFileSync(console.https.certificate, 'utf8');

    const credentials = {key: privateKey, cert: certificate};
    const appHttps = https.createServer(credentials, app);
    console.log(colors.green("SSL enabled. Connections will be encrypted."));
} else {
    app.listen(config.port);
    console.log(colors.red("WARNING: SSL disabled! Connections won't be encrypted."));
}
console.log(colors.green("Listening on port " + config.port + "."));