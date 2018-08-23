import axios from 'axios'
import { elements } from '../playerbase'

export class serverApi {
    constructor(URL = `http://localhost:3000`) {
        this.URL = URL;
    }

    getUrl() {
        const res = axios.get(this.URL)
        .then( (response) => {
            console.log(response);
        })
        .catch( (error) => {
            console.log(error);
        });
    }

    postTest() {
        const res = axios.post(`${this.URL}/auth/openid`)
        .then( (response) => {
            console.log(response);
            elements.response.insertAdjacentHTML('beforeend', response.data);
        })
        .catch( (error) => {
            console.log(error);
        });
    }
}
