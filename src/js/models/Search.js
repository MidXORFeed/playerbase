import { SteamAPIKey, proxy } from '../config'
import axios from 'axios'


export default class Search {
    constructor(appid) {
        this.appid = appid;
    }

    getResults() {
    
        let interfaceName = 'ISteamUser';
        let methodName = 'GetPlayerSummaries';
        let versionName = '2';
        let steamids = 76561198034979625;
        const res = axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}?key=${SteamAPIKey}&steamids=${steamids}`)
        .then( (response) => {
            console.log(response);
        })
        .catch( (error) => { 
            console.log(error);
        });
    }

    getOwnedGames() {
        let interfaceName = 'IPlayerService';
        let methodName = 'GetOwnedGames';
        let versionName = '1';
        let steamids = '76561198034979625';
        let include_appinfo = 1;
        let include_played_free_games = 1;
        let appids_filter = '';
        const res = axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}/?key=${SteamAPIKey}&format=json&steamid=${steamids}&include_appinfo=${include_appinfo}&include_played_free_games=${include_played_free_games}&appids_filter=${appids_filter}`)
        .then( (response) => {
            console.log(response);
        })
        .catch( (error) => { 
            console.log(error);
        });
    }

    getInventoryData() {
        let appid = 570;
        let steamids = '76561198034979625';
        axios.get(`${proxy}http://steamcommunity.com/inventory/${steamids}/${appid}/2?l=english&count=5000`)
        .then( (response) => {
            console.log(response);
        })
        .catch( (error) => { 
            console.log(error);
        });
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