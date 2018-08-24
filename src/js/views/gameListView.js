import { elements, steamMarketApps } from '../playerbase'

export const renderGameList = (listOfGames) => {
    let markup = ``;
    listOfGames.forEach(element => {
        if (element.img_icon_url != "" && 
            element.playtime_forever >= 0 && 
            steamMarketApps.indexOf(element.appid) >= 0) {
            const img_url = `http://media.steampowered.com/steamcommunity/public/images/apps/${element.appid}/${element.img_icon_url}.jpg`;
            markup += 
            `<li id=${element.appid} class="game_listItem">
                <img src="${img_url}"></img>
                <span>${element.name}</span>
            </li>`
        }
    });
    elements.gameList.insertAdjacentHTML('afterbegin', markup);
};