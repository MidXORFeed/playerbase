import { elements } from '../playerbase'

export const renderLoginBtn = () => {
    const markup = 
    `<button id="sso-btn"> 
        <img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/sits_large_border.png" alt="Login with Steam"></img>
    </button>`;
    elements.response.insertAdjacentHTML('beforeend', markup);
};