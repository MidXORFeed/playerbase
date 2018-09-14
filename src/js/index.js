import { elements, controllers, models, views } from './playerbase'
import { serverApi } from  './misc/serverApi'

const state = {};

elements.searchBtn.addEventListener('click', e => {
    state.steamID = views.searchView.getInput();
    getOwnedSteamApps(state.steamID);
    views.gameInventoryListView.clearInventoryList();
});

elements.gameList.addEventListener('click', async(e) => {
    state.gameAppID = e.target.closest('.game_listItem').id;
    state.displayNInventoryItems = 10;

    try {
        const gameAssetPricesPromise = getGameAssetPrices(state.gameAppID);
        const gameInventoryPromise = getGameInventory(state.Search.steamid, state.gameAppID);
        await gameAssetPricesPromise;
        await gameInventoryPromise;
    } catch (error) {
        console.log(error);
    } finally {
        state.Inventory.setInventoryValue(state.Search.steamid, state.gameAppID, state.AssetPrice);
        displayNInventoryItems(state.Inventory.inventories[state.Search.steamid + '_' + state.gameAppID], state.AssetPrice.allItemPrices[state.gameAppID], state.AssetPrice.priceDataForItemsOnSale[state.gameAppID], 1, state.displayNInventoryItems);
    }
});    

elements.gameInventoryList.addEventListener('click', async(e) => {
    if (e.target.closest('.btn-inline')) {
        const btn = e.target.closest('.btn-inline');
        const goToPage = parseInt(btn.dataset.goto, 10);
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], state.AssetPrice.allItemPrices[state.gameAppID], state.AssetPrice.priceDataForItemsOnSale[state.gameAppID], goToPage, state.displayNInventoryItems);
    } else if (e.target.closest('.btn-display10')) {
        state.displayNInventoryItems = 10;
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], state.AssetPrice.allItemPrices[state.gameAppID], state.AssetPrice.priceDataForItemsOnSale[state.gameAppID], 1, state.displayNInventoryItems);
    } else if (e.target.closest('.btn-display50')) {
        state.displayNInventoryItems = 50;
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], state.AssetPrice.allItemPrices[state.gameAppID], state.AssetPrice.priceDataForItemsOnSale[state.gameAppID], 1, state.displayNInventoryItems);
    } else if (e.target.closest('.btn-display100')) {
        state.displayNInventoryItems = 100;
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], state.AssetPrice.allItemPrices[state.gameAppID], state.AssetPrice.priceDataForItemsOnSale[state.gameAppID], 1, state.displayNInventoryItems);
    } else if (e.target.closest('.btn-displayAll')) {
        state.displayNInventoryItems = state.Inventory.inventories[state.steamID + '_' + state.gameAppID].length;
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], state.AssetPrice.allItemPrices[state.gameAppID], state.AssetPrice.priceDataForItemsOnSale[state.gameAppID], 1, state.displayNInventoryItems);
    } else if (e.target.closest('.inventory__item-showmore')) {
        if (!state.Graphs) { state.Graphs = new models.Graphs() };
        const marketHashName = e.target.parentElement.parentElement.id;
        state.Graphs.removeItemSalesGraph(state.gameAppID, marketHashName);
        toggleRecentItemSalesInfo(marketHashName, state.AssetPrice.recentItemSalesInfo[state.gameAppID][marketHashName]);
    } else if (e.target.closest('.inventory__item-showless')) {
        if (!state.Graphs) { state.Graphs = new models.Graphs() };
        const marketHashName = e.target.parentElement.id;
        await addRecentItemSalesInfo(state.gameAppID, marketHashName);
        state.Graphs.addItemSalesGraph(state.gameAppID, marketHashName);
        toggleRecentItemSalesInfo(marketHashName, state.AssetPrice.recentItemSalesInfo[state.gameAppID][marketHashName]);
    }
});

const getOwnedSteamApps = async(steamID) => {
    if (!state.Search) { state.Search = new models.Search(steamID) };
    try {
        const ownedGames = await state.Search.getOwnedGames(steamID); 
        if (!state.Search.isSearched(steamID)) {
            state.Search.addSearch(steamID, ownedGames);
            state.Search.sortOwnedGames(steamID);
        }
        views.gameListView.clearGamesList();
        views.gameListView.renderGameList(state.Search.searches[steamID]);
    } catch (error) {
        console.log(error);
    }
}

const getGameInventory = async(steamid, gameAppID) => {
    if (!state.Inventory) { state.Inventory = new models.Inventory() };
    try {
        const inventory = await state.Inventory.getInventoryData(steamid, gameAppID);
        if (!state.Inventory.isRetrieved(steamid, gameAppID)) {
            state.Inventory.addInventory(steamid, gameAppID, inventory);
        }
    } catch (error) {
        console.log(error);
    }
}

const getGameAssetPrices = async(gameAppID) => {
    if (!state.AssetPrice) { state.AssetPrice = new models.AssetPrice() };
    try {
        const allItemPrices = state.AssetPrice.getAllItemPrices(gameAppID);
        const priceDataForItemsOnSale = state.AssetPrice.getPriceDataForItemsOnSale(gameAppID);
        await allItemPrices
        .then( (res) => {
            if (!state.AssetPrice.isAllItemPricesRetrieved(gameAppID)) {
                state.AssetPrice.addAllItemPrices(gameAppID, res);
            }
        });
        await priceDataForItemsOnSale
        .then( (res) => {
            if (!state.AssetPrice.isPriceDataForItemsOnSaleRetrieved(gameAppID)) {
                state.AssetPrice.addPriceDataForItemsOnSale(gameAppID, res);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const addRecentItemSalesInfo = async(gameAppID, marketHashName) => {
    if (!state.AssetPrice) { state.AssetPrice = new models.AssetPrice() };
    try {
        const recentItemSalesInfo = await state.AssetPrice.getRecentSalesInfo(marketHashName, gameAppID);
        if (!state.AssetPrice.isRecentItemSalesInfoRetrieved(marketHashName, gameAppID)) {
            state.AssetPrice.addRecentSalesInfo(gameAppID, marketHashName, recentItemSalesInfo);
        }
    } catch (error) {
        console.log(error);
    }
}

const displayNInventoryItems = (inventory, allItemPrices, priceDataForItemsOnSale, goToPage, resultsPerPage) => {
    views.gameInventoryListView.clearInventoryList();
    views.gameInventoryListView.renderResults(inventory, allItemPrices, priceDataForItemsOnSale, goToPage, resultsPerPage);
    views.gameInventoryListView.renderDisplayQuantityButtons(inventory);
}

const toggleRecentItemSalesInfo = (marketHashName, recentItemSalesInfo) => {
    if (state.Graphs.itemSalesList[state.gameAppID].indexOf(marketHashName) == -1) {
        views.gameInventoryListView.unrenderRecentItemSalesInfoChart(marketHashName);
    } else {
        views.gameInventoryListView.renderRecentItemSalesInfoChart(marketHashName, recentItemSalesInfo);
    }
}