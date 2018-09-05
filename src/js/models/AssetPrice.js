import totp from 'notp'
import base32 from 'thirty-two'
import { SteamAPIKey, BitSkinsAPIKey, BitSkinsSecret, proxy } from '../config'
import axios from 'axios'

export default class AssetPrice {
    constructor() {
        this.assetPrices = {};
    }

    addAssetPrices(gameAppID, assetPrices) {
        if (!this.assetPrices[gameAppID]) {
            this.assetPrices[gameAppID] = {};
            assetPrices.forEach(element => {
                this.assetPrices[gameAppID][element.market_hash_name] = element.price
            });
        }
    }

    isRetrieved(gameAppID) {
        return this.assetPrices[gameAppID] !== undefined;
    }

    async getAssetPrices(appid) {
        let authToken = totp.totp.gen(base32.decode(`${BitSkinsSecret}`));
        const versionName = '1';
        if (!this.assetPrices[appid]) { 
            try {
                const res = await axios.post(`https://bitskins.com/api/v${versionName}/get_all_item_prices/?api_key=${BitSkinsAPIKey}&app_id=${appid}&code=${authToken}`);
                return res.data.prices;
            } catch (error) {
                console.log(error);
            }
        }
        return this.assetPrices[appid];
    }
}