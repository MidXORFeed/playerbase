import { SteamAPIKey, proxy } from '../config'
import axios from 'axios'


export default class Search {
    constructor(steamid) {
        this.steamid = steamid;
        this.searches = [];
    }

    addSearch(steamid, search) {
        if (!this.searches[steamid])
            this.searches[steamid] = search;
    }

    isSearched(steamid) {
        return this.searches.findIndex(el => el === steamid) !== -1;
    }
    
    sortOwnedGames(steamid) {
        this.searches[steamid].sort( (a, b) => {
            if (a.name.toUpperCase() < b.name.toUpperCase())
                return -1;

            if (a.name.toUpperCase() > b.name.toUpperCase())
                return 1;

            return 0;
        });
    }

    async getOwnedGames(steamid) {
        const interfaceName = 'IPlayerService';
        const methodName = 'GetOwnedGames';
        const versionName = '1';
        let include_appinfo = 1;
        let include_played_free_games = 1;
        let appids_filter = '';
        this.steamid = steamid;
        try {
            if (!this.searches[steamid]) {
                const res = await axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}/?key=${SteamAPIKey}&format=json&steamid=${steamid}&include_appinfo=${include_appinfo}&include_played_free_games=${include_played_free_games}&appids_filter=${appids_filter}`);
                return res.data.response.games;
            }
            return this.searches[steamid];
        } catch (error) {
            console.log(error);
        }
    }

    // async getPlayerSummaries() {
    //     const interfaceName = 'ISteamUser';
    //     const methodName = 'GetPlayerSummaries';
    //     const versionName = '2';
    //     try {
    //         const res = await axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}?key=${SteamAPIKey}&steamids=${this.steamid}`);
    //     } catch(error) { 
    //         console.log(error);
    //     };
    // }
}