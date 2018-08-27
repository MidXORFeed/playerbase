import { SteamAPIKey, proxy } from '../config'
import axios from 'axios'

export default class AssetPrice {
    constructor(appid) {
        this.appid = appid;
    }

    async getAssetPrices() {
        const interfaceName = 'ISteamEconomy';
        const methodName = 'GetAssetPrices';
        const versionName = '1';
        let currency = 'CAD';
        let language = '';
        try {
            if (!this.assetPriceData) {
                const res = await axios.get(`https://api.steampowered.com/${interfaceName}/${methodName}/v${versionName}/?key=${SteamAPIKey}&format=json&appid=${this.appid}&currency=${currency}&language=${language}`);
                this.assetPriceData = res.data.result.assets;
            }
            return this.assetPriceData;
        } catch (error) {
            console.log(error);
        }
    }
}