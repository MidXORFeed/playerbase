export default class Graphs {
    constructor() {
        this.itemSalesList = {};
    }

    addItemSalesGraph(appid, marketHashName) {
        if (!this.itemSalesList[appid]) { this.itemSalesList[appid] = []; }
        if (this.itemSalesList[appid].indexOf(marketHashName) == -1) { 
            this.itemSalesList[appid].push(marketHashName); 
        }
    }

    removeItemSalesGraph(appid, marketHashName) {
        if (!this.itemSalesList[appid]) { this.itemSalesList[appid] = []; }
        const index = this.itemSalesList[appid].findIndex(el => el === marketHashName)
        this.itemSalesList[appid].splice(index, 1);
    }
}