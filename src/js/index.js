import { elements, controllers, models, views } from './playerbase'
import { serverApi } from  './misc/serverApi'

const state = {};

if (!state.Authenticate) {
    views.authenticateView.renderLoginBtn();
}

const api = new serverApi();

elements.httpBtn.addEventListener('click', e => {
    const resp = api.getUrl();
});

elements.response.addEventListener('click', e => {

    if (e.target.closest('#sso-btn')) {
        const resp = api.postTest()
    }
});

window.state = state;