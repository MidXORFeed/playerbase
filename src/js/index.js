import { elements, controllers, models, views } from './playerbase'
import { serverApi } from  './misc/serverApi'

const state = {};

const api = new serverApi();

elements.searchBtn.addEventListener('click', e => {
    searchSteamID();
});

const searchSteamID = async() => {
    const steamID = views.searchView.getInput();
    if (!state.Search) {
        state.Search = new models.Search(steamID);
        try {
            await state.Search.getOwnedGames();
            views.gameListView.renderGameList(state.Search.ownedGames);
        } catch (error) {
            console.log(error);
        }
    }

    // 1. Get list of games owned by player

    // 2. Render list of games owned by player

    // state.Search.getPlayerSummaries()
    // state.Search.getInventoryData();
    // state.Search.getAssetPrices();
}

window.state = state;