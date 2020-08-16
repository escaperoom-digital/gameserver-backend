/**
 * player.js
 * 
 * @author Fabian Schmitt
 * @version 2020-08-16
 * 
 * @description
 * This file defines the class 'Player'. It is used to store the current players within
 * a game as well as to get information on a player after a round is over.
 */


class Player {

    /** Constructor of player. Set default values. */
    constructor() {
        this.name = "";
        this.playerToken = "";
    }

    /**
     * Generate a new player token used to automatically identify the player.
     * @returns new token
     */
    generatePlayerToken() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var token = "";
        for(var i = 0; i < 32; i++) {
            token += chars.charAt(Math.random(0, chars.length - 1));
        }
        this.playerToken = token;
        return token;
    }

    /**
     * Set new player token.
     * @param playerToken new player token
     */
    setPlayerToken(playerToken) {
        this.playerToken = playerToken;
    }

    /**
     * Set player name.
     * @param name new name
     */
    setName(name) {
        this.name = name;
    }

    /**
     * Get player token.
     * @returns token
     */
    getPlayerToken() {
        return this.playerToken;
    }

    /**
     * Get player name.
     * @returns player name
     */
    getName() {
        return this.name;
    }

}


exports.Player = Player;