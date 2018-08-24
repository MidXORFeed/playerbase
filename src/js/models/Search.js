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
            console.log(res);
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
        } catch (error) {
            console.log(error);
        }
    }

    async getInventoryData(appid) {
        try {
            const res = await axios.get(`${proxy}http://steamcommunity.com/inventory/${this.steamid}/${appid}/2?l=english&count=5000`);
            this.inventoryData = res;
            console.log(res);
        } catch (error) {
            console.log("Failed to retrieve inventory data for game");
        }
    }

    getAssetPrices() {
        let interfaceName = 'ISteamEconomy';
        let methodName = 'GetAssetPrices';
        let versionName = '1';
        let appid = 570;
        let currency = 'CAD';
        let language = '';
        axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}/?key=${SteamAPIKey}&format=json&appid=${appid}&currency=${currency}&language=${language}`)
        .then( (response) => {
            console.log(response);
        })
        .catch( (error) => { 
            console.log(error);
        });
    }
}