import totp from 'notp'
import base32 from 'thirty-two'
import { SteamAPIKey, BitSkinsAPIKey, BitSkinsSecret, proxy } from '../config'
import axios from 'axios'

export default class Inventory {
    constructor() {
        this.inventories = {};
    }

    setInventoryValue(steamid, gameAppID, AssetPrice) {
        if (this.inventories[steamid + '_' + gameAppID]) {
            if (!this.inventories[steamid + '_' + gameAppID].totals) { 
                this.inventories[steamid + '_' + gameAppID].totals = {
                    currentTotal: 0,
                    lowTotal: 0,
                    suggestedTotal: 0
                } 
                this.inventories[steamid + '_' + gameAppID].forEach(item => {
                    if (AssetPrice.allItemPrices[gameAppID][item.market_hash_name])
                        this.inventories[steamid + '_' + gameAppID].totals.currentTotal += item.number_of_items * parseFloat(AssetPrice.allItemPrices[gameAppID][item.market_hash_name].current_price);
                    if (AssetPrice.priceDataForItemsOnSale[gameAppID][item.market_hash_name])
                        this.inventories[steamid + '_' + gameAppID].totals.lowTotal += item.number_of_items * parseFloat(AssetPrice.priceDataForItemsOnSale[gameAppID][item.market_hash_name].lowest_price);
                    if (item.suggested_price !== null) 
                        this.inventories[steamid + '_' + gameAppID].totals.suggestedTotal += item.number_of_items * parseFloat(item.suggested_price);
                });
            };
        }
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
        const methodName = 'get_my_inventory';
        const versionName = '1';
        if (!this.inventories[steamid + '_' + appid]) {
            try {
                const res = await axios.post(`https://bitskins.com/api/v${versionName}/${methodName}/?api_key=${BitSkinsAPIKey}&page=1&app_id=${appid}&code=${authToken}`);
                return res.data.data.steam_inventory.items;
            } catch (error) {
                console.log("Failed to retrieve inventory data for game");
            }
        }
        return this.inventories[steamid + '_' + appid];
    }
}