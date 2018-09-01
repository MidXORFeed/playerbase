import { SteamAPIKey, proxy } from '../config'
import axios from 'axios'

export default class Inventory {
    constructor() {
        this.inventories = {};
    }

    addInventory(steamid, gameAppID, inventory) {
        if (!this.inventories[steamid + '_' + gameAppID])
            this.inventories[steamid + '_' + gameAppID] = inventory;
    }

    isRetrieved(steamid, gameAppID) {
        return this.inventories[steamid + '_' + gameAppID] !== undefined;
    }

    async getInventoryData(steamid, appid) {
        if (!this.inventories[steamid + '_' + appid]) {
            try {
                const res = await axios.get(`${proxy}http://steamcommunity.com/inventory/${steamid}/${appid}/2?l=english&count=5000`);
                return res.data.descriptions;
            } catch (error) {
                console.log("Failed to retrieve inventory data for game");
            }
        }
        return this.inventories[steamid + '_' + appid];
    }
}