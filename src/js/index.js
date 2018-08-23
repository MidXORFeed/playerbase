import { elements, controllers, models, views } from './playerbase'
import { serverApi } from  './misc/serverApi'

const state = {};

if (!state.Authenticate) {
    views.authenticateView.renderLoginBtn();
}

const api = new serverApi();

state.Search = new models.Search();
// state.Search.getResults();
// state.Search.getInventoryData();
// state.Search.getAssetPrices();

elements.httpBtn.addEventListener('click', e => {
    const resp = api.getUrl();
});

elements.response.addEventListener('click', e => {
    if (e.target.closest('#sso-btn')) {
        const resp = api.postTest()
    }
});

window.state = state;