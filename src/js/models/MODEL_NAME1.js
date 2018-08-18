import { key } from '../config'
import { axios } from 'axios'

export default class Search {
    constructor(query) {
        this.query = query;
    }
}

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = axios(`https://api.steampowered.com/${interface}/${method}/v${version}/`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}