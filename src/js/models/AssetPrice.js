import totp from 'notp'
import base32 from 'thirty-two'
import { SteamAPIKey, BitSkinsAPIKey, BitSkinsSecret, proxy } from '../config'
import axios from 'axios'

export default class AssetPrice {
    constructor() {
        this.allItemPrices = {};
        this.priceDataForItemsOnSale = {};
    }

    addAllItemPrices(gameAppID, assetPrices) {
        if (!this.allItemPrices[gameAppID]) {
            this.allItemPrices[gameAppID] = {};
            assetPrices.forEach(element => {
                this.allItemPrices[gameAppID][element.market_hash_name] = { 
                    current_price: element.price,
                    name_color: element.name_color,
                    rarity_color: element.rarity_color
                };
            });
        }
    }
    
    addPriceDataForItemsOnSale(gameAppID, itemsOnSalePriceData) {
        if (!this.priceDataForItemsOnSale[gameAppID]) {
            this.priceDataForItemsOnSale[gameAppID] = {};
            itemsOnSalePriceData.forEach(element => {
                this.priceDataForItemsOnSale[gameAppID][element.market_hash_name] = {
                    lowest_price: element.lowest_price,
                    highest_price: element.highest_price
                }
            });
        }
    }

    isAllItemPricesRetrieved(gameAppID) {
        return this.allItemPrices[gameAppID] !== undefined;
    }

    isPriceDataForItemsOnSaleRetrieved(gameAppID) {
        return this.priceDataForItemsOnSale[gameAppID] !== undefined;
    }

    async getAllItemPrices(appid) {
        let authToken = totp.totp.gen(base32.decode(`${BitSkinsSecret}`));
        const versionName = '1';
        const methodName = 'get_all_item_prices';
        if (!this.allItemPrices[appid]) { 
            try {
                const res = await axios.post(`https://bitskins.com/api/v${versionName}/${methodName}/?api_key=${BitSkinsAPIKey}&app_id=${appid}&code=${authToken}`);
                return res.data.prices;
            } catch (error) {
                console.log(error);
            }
        }
        return this.allItemPrices[appid];
    }

    async getPriceDataForItemsOnSale(appid) {
        let authToken = totp.totp.gen(base32.decode(`${BitSkinsSecret}`));
        const versionName = '1';
        const methodName = 'get_price_data_for_items_on_sale';
        if (!this.priceDataForItemsOnSale[appid]) { 
            try {
                const res = await axios.post(`https://bitskins.com/api/v${versionName}/${methodName}/?api_key=${BitSkinsAPIKey}&app_id=${appid}&code=${authToken}`);
                return res.data.data.items;
            } catch (error) {
                console.log(error);
            }
        }
        return this.priceDataForItemsOnSale[appid];
    }
}