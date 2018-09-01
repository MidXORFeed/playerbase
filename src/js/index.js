import { elements, controllers, models, views } from './playerbase'
import { serverApi } from  './misc/serverApi'

const state = {};
state.AssetPrice = {};

elements.searchBtn.addEventListener('click', e => {
    state.steamID = views.searchView.getInput();
    getOwnedSteamApps(state.steamID);
    views.gameInventoryListView.clearInventoryList();
});

elements.gameList.addEventListener('click', e => {
    state.gameAppID = e.target.closest('.game_listItem').id;
    state.displayNInventoryItems = 10;
    getGameAssetPrices(state.gameAppID);
    getGameInventory(state.Search.steamid, state.gameAppID);
});    

elements.gameInventoryList.addEventListener('click', e => {
    if (e.target.closest('.btn-inline')) {
        const btn = e.target.closest('.btn-inline');
        const goToPage = parseInt(btn.dataset.goto, 10);
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], goToPage, state.displayNInventoryItems);
    } else if (e.target.closest('.btn-display10')) {
        state.displayNInventoryItems = 10;
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], 1, state.displayNInventoryItems);
    } else if (e.target.closest('.btn-display50')) {
        state.displayNInventoryItems = 50;
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], 1, state.displayNInventoryItems);
    } else if (e.target.closest('.btn-display100')) {
        state.displayNInventoryItems = 100;
        displayNInventoryItems(state.Inventory.inventories[state.steamID + '_' + state.gameAppID], 1, state.displayNInventoryItems);
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
        displayNInventoryItems(inventory, 1, 10);
    } catch (error) {
        console.log(error);
    }
}

const getGameAssetPrices = async(gameAppID) => {
    if (!state.AssetPrice[gameAppID]) { state.AssetPrice[gameAppID] = new models.AssetPrice(gameAppID) };
    try {
        await state.AssetPrice[gameAppID].getAssetPrices();
    } catch (error) {
        console.log(error);
    }
}

const displayNInventoryItems = (inventory, goToPage, resultsPerPage) => {
    views.gameInventoryListView.clearInventoryList();
    views.gameInventoryListView.renderResults(inventory, goToPage, resultsPerPage);
    views.gameInventoryListView.renderDisplayQuantityButtons(inventory);
}

window.state = state;

// state.Search.getPlayerSummaries()
// state.Search.getInventoryData();
// state.Search.getAssetPrices();