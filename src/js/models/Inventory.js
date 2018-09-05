import totp from 'notp'
import base32 from 'thirty-two'
import { SteamAPIKey, BitSkinsAPIKey, BitSkinsSecret, proxy } from '../config'
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
        let authToken = totp.totp.gen(base32.decode(`${BitSkinsSecret}`));
        if (!this.inventories[steamid + '_' + appid]) {
            try {
                const res = await axios.post(`https://bitskins.com/api/v1/get_my_inventory/?api_key=${BitSkinsAPIKey}&page=1&app_id=${appid}&code=${authToken}`);
                return res.data.data.steam_inventory.items;
            } catch (error) {
                console.log("Failed to retrieve inventory data for game");
            }
        }
        return this.inventories[steamid + '_' + appid];
    }
}