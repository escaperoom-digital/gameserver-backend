/**
 * game.js
 * 
 * @author Fabian Schmitt
 * @version 2020-08-16
 * 
 * @description
 * This file defines the class 'Game'. It is used to keep track of all games
 * currently running as well as to get the information after the game has ended.
 */


/** Class  */
class Game {

    /** Constructor of Game. */
    constructor(maxPlayers) {
        this.maxPlayers = maxPlayers;
        this.gameId = 0;
        this.adminPlayer = null;
        this.players = [];
        this.state = 1;     // 0: finished; 1: waiting; 2: playing; 3: failed; 4: aborted
    }

    /**
     * Generate new gameId. Used if game doesn't exist yet.
     */
    generateNewGameId() {
        this.gameId = Math.floor(Math.random() * 99999999);
        return this.gameId;
    }

    /**
     * Join new player to the game.
     * @param player new player.
     */
    joinPlayer(player) {
        if(this.players.length >= this.maxPlayers) return false;
        for(var i = 0; i < this.players.length; i++) if(this.players[i].getName() == player.getName()) return false;
        this.players.push(player);
        return true;
    }

    /**
     * Quit player from the game.
     * @param player player to quit
     */
    quitPlayer(player) {
        for(var i = 0; i < this.players.length; i++) {
            if(this.players[i] == player) {
                this.players.pop[i];
                break;
            }
        }
    }

    /**
     * Set the admin player. He has complete controll over the game instance.
     * @param adminPlayer new adminPlayer
     */
    setAdminPlayer(adminPlayer) {
        this.adminPlayer = adminPlayer;
    }

    /**
     * Set the game state. Definitions are listed at constructor.
     * @param state new state
     */
    setState(state) {
        this.state = state;
    }

    /**
     * Set the gameId
     * @param gameId new gameId
     */
    setGameId(gameId) {
        this.gameId = gameId;
    }

    /**
     * Get the administrative player.
     * @returns adminPlayer
     */
    getAdminPlayer() {
        return this.adminPlayer
    }

    /**
     * Get the current game state.
     * @returns game state
     */
    getState() {
        return this.state;
    }

    /**
     * Get the gameId.
     * @returns gameId
     */
    getGameId() {
        return this.gameId;
    }

    /**
     * Get the players which are currently part of the game.
     * @returns current players
     */
    getCurrentPlayers() {
        return this.players;
    }

}


exports.Game = Game;