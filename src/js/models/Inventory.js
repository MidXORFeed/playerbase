import { SteamAPIKey, proxy } from '../config'
import axios from 'axios'

export default class Inventory {
    constructor() {

    }

    async getInventoryData(steamid, appid) {
        try {
            if (!this.inventoryData) {
                const res = await axios.get(`${proxy}http://steamcommunity.com/inventory/${steamid}/${appid}/2?l=english&count=5000`);
                this.inventoryData = res.data.descriptions;
            }
            return this.inventoryData;
        } catch (error) {
            console.log(error);
            console.log("Failed to retrieve inventory data for game");
        }
    }
}