import { elements, controllers, models, views } from './playerbase'
import axios from 'axios'
import { proxy } from './config'

/*
const state = {};
state.Search = new models.Search();
state.Search.getResults();

window.state = state;
*/

elements.httpBtn.addEventListener('click', e => {
    axios.get(`http://localhost:3000`)
    .then( (response) => {
        console.log(response);
    })
    .catch( (error) => {
        console.log(error);
    })
});