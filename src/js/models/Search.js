import { SteamAPIKey, proxy } from '../config'
import axios from 'axios'


export default class Search {
    constructor(steamid) {
        this.steamid = steamid;
    }

    async getPlayerSummaries() {
        const interfaceName = 'ISteamUser';
        const methodName = 'GetPlayerSummaries';
        const versionName = '2';
        try {
            const res = await axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}?key=${SteamAPIKey}&steamids=${this.steamid}`);
        } catch(error) { 
            console.log(error);
        };
    }

    async getOwnedGames() {
        const interfaceName = 'IPlayerService';
        const methodName = 'GetOwnedGames';
        const versionName = '1';
        let include_appinfo = 1;
        let include_played_free_games = 1;
        let appids_filter = '';
        try {
            const res = await axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}/?key=${SteamAPIKey}&format=json&steamid=${this.steamid}&include_appinfo=${include_appinfo}&include_played_free_games=${include_played_free_games}&appids_filter=${appids_filter}`);
            this.ownedGames = res.data.response.games;
            return this.ownedGames;
        } catch (error) {
            console.log(error);
        }
    }
}