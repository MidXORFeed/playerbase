import { controllers, models, views} from './playerbase'

const state = {};
state.Search = new models.Search();
state.Search.getResults();

window.state = state;