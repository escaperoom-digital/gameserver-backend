/**
 * gameUtils.js
 * 
 * @author Fabian Schmitt
 * @version 2020-08-16
 * @description
 * This file is home to auxiliary functions which help to manage the
 * games currently running as well as those which are already completed.
 */


const Game = require("./game.js");


/** Singleton class for GameUtils. Necessary as there are certain attributes which must be passed over (maxGames, databaseConnection). */
class GameUtils {

    constructor() {
        this.maxGames = 0;
        this.maxPlayers = 0;
        this.databaseConnection = null;
        this.runningGames = [];
    }

    /**
     * Set max number of games allowed to run simultaneously.
     * @param maxGames
     */
    setMaxGames(maxGames) {
        this.maxGames = maxGames;
    }

    /**
     * Set max number of players per game allowed.
     * @param maxPlayers
     */
    setMaxPlayers(maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    /**
     * Set the database connection used to query MySQL DB.
     * @param databaseConnection
     */
    setDatabaseConnection(databaseConnection) {
        this.databaseConnection = databaseConnection;
    }

    /**
     * Create new game.
     * @returns created game
     */
    createNewGame() {
        if(this.runningGames.length >= this.maxGames) return null;
        let game = new Game.Game(this.maxPlayers);
        game.generateNewGameId();
        while(this.gameIdExists(game.getGameId())) game.generateNewGameId();
        this.runningGames.push(game);
        return game;
    }

    /**
     * Start game with provided id.
     * @param gameId 
     * @returns success
     */
    startGame(gameId) {
        var game = this.getGameById(gameId);
        if(game == null || game.getState() != 1) return false;
        game.setState(2);
        return true;
    }

    /**
     * Abort game identified by provided id.
     * @param gameId 
     * @returns success
     */
    abortGame(gameId) {
        var game = this.getGameById(gameId);
        if(game == null || game.getState() != 2) return false;
        game.setState(4);
        return true;
    }


    /**
     * Query whether game by id exists.
     * @param gameId
     * @returns whether game identified by this id exists
     */
    gameIdExists(gameId) {
        return (this.getGameById(gameId) == null) ? false : true;
    }

    /**
     * Query game by id.
     * @param gameId
     * @returns game found with matching id (if none: null)
     */
    getGameById(gameId) {
        for(var i = 0; i < this.runningGames.length; i++) if(this.runningGames[i].getGameId() == gameId) return game;
        return null;
    }

    getGames() {
        return this.runningGames;
    }

}


/** Create singleton instance. */
let instance = new GameUtils();


exports.GameUtils = instance;