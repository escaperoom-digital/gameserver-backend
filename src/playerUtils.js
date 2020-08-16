/**
 * playerUtils.js
 * 
 * @author Fabian Schmitt
 * @version 2020-08-16
 * @description
 * This file contains auxiliary functions which help to manage the players currently
 * in a game as well as those with accounts.
 */


const Player = require("./player.js");


/** Singleton class for PlayerUtils. Necessary as there are certain attributes which must be passed over (databaseConnection). */
class PlayerUtils {

    constructor() {
        this.databaseConnection = null;
        this.playingPlayers = [];
    }

    /**
     * Set the MySQL database connection.
     * @param databaseConnection 
     */
    setDatabaseConnection(databaseConnection) {
        this.databaseConnection = databaseConnection;
    }

    /**
     * Set player persistent (= store in DB).
     * @param player 
     * @returns success
     */
    createPersistantPlayer(player) {
        if(this.databaseConnection == null) return false;
        return true;
    }

    /**
     * 
     * @param authPlayer 
     */
    authenticatePlayer(authPlayer) {
        var player = getPlayer(player);
        if(player == null) return false;
        return (authPlayer.getPlayerToken() == player.getPlayerToken());
    }

    /**
     * Get player.
     * @param player
     * @returns player (null if not exists)
     */
    getPlayer(player) {
        for(var i = 0; i < this.playingPlayers.length; i++) if(this.playingPlayers[i].getName() == player.getName()) return this.playingPlayers[i];
        return null;
    }

    /**
     * Get whether player exists.
     * @param player
     * @returns whether player exists
     */
    playerExists(player) {
        return (this.getPlayer(player) == null) ? false : true;
    }

    /**
     * Add player to list of players.
     * @param player 
     * @returns success
     */
    joinPlayer(player) {
        if(this.playerExists(player)) return false;
        this.playingPlayers.push(player);
        return true;
    }

    /**
     * Remove player from list of players.
     * @param player
     * @returns success
     */
    quitPlayer(player) {
        for(var i = 0; i < this.playingPlayers.length; i++) if(this.playingPlayers[i].getName() == player.getName()) this.playingPlayers.pop(i); break;
        return true;
    }

}


/** Create singleton instance. */
let instance = new PlayerUtils();


exports.PlayerUtils = instance;