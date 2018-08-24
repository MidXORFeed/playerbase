import { elements, controllers, models, views } from './playerbase'
import { serverApi } from  './misc/serverApi'

const state = {};

const api = new serverApi();

elements.searchBtn.addEventListener('click', e => {
    const steamID = views.searchView.getInput();
    searchSteamID(steamID);
});

const searchSteamID = async(steamID) => {
    if (!state.Search) {
        state.Search = new models.Search(steamID);

        try {
            await state.Search.getOwnedGames();
            views.gameListView.renderGameList(state.Search.ownedGames);
        } catch (error) {
            console.log(error);
        }
    }
}

elements.gameList.addEventListener('click', e => {
    const gameAppID = e.target.closest('.game_listItem').id;
    searchGameInventory(gameAppID);
});

const searchGameInventory = async(gameAppID) => {
    try {
        await state.Search.getInventoryData(gameAppID);
    } catch (error) {
        console.log(error);
    }
}

window.state = state;

// state.Search.getPlayerSummaries()
// state.Search.getInventoryData();
// state.Search.getAssetPrices();