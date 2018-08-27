import { elements, controllers, models, views } from './playerbase'
import { serverApi } from  './misc/serverApi'

const state = {};
state.Inventory = {};
state.AssetPrice = {};

const api = new serverApi();

elements.searchBtn.addEventListener('click', e => {
    const steamID = views.searchView.getInput();
    getOwnedSteamApps(steamID);
});

const getOwnedSteamApps = async(steamID) => {
    if (!state.Search) { state.Search = new models.Search(steamID) };
    try {
        await state.Search.getOwnedGames();
        views.gameListView.renderGameList(state.Search.ownedGames);
    } catch (error) {
        console.log(error);
    }
}

elements.gameList.addEventListener('click', e => {
    const gameAppID = e.target.closest('.game_listItem').id;
    getGameInventory(state.Search.steamid, gameAppID);
    getGameAssetPrices(gameAppID);
});    

const getGameInventory = async(steamid, gameAppID) => {
    if (!state.Inventory[steamid + '_' + gameAppID]) { state.Inventory[steamid + '_' + gameAppID] = new models.Inventory() };
    try {
        await state.Inventory[steamid + '_' + gameAppID].getInventoryData(steamid, gameAppID);
        views.gameInventoryListView.renderInventoryList(state.Inventory[steamid + '_' + gameAppID].inventoryData);
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

window.state = state;

// state.Search.getPlayerSummaries()
// state.Search.getInventoryData();
// state.Search.getAssetPrices();