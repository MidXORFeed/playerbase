import { SteamAPIKey } from '../config'
import axios from 'axios'

export default class Search {
    constructor(appid) {
        this.appid = appid;
    }

    getResults() {
        let interfaceName = 'ISteamApps';
        let methodName = 'GetAppList';
        let versionName = '2';
        const res = axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}/`)
        .then( (response) => {
            console.log(response);
        })
        .catch( (error) => { 
            console.log(error);
        });
    }
}

