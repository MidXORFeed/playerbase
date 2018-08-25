import { elements } from '../playerbase'

export const renderInventoryList = (inventoryList) => {
    let markup = ``;
    if (inventoryList) {
        inventoryList.forEach(element => {
            const icon_url = `https://steamcommunity-a.akamaihd.net/economy/image/${element.icon_url}`;
            markup += 
            `<li id="${element.appid}_${element.classid}">
                <img src="${icon_url}" class="game_inventoryItem"></img>
                <span>${element.name}</span>
            </li>`
        });
    } else {
        markup = `You have no steam items for this specific game!`;
    }
    elements.gameInventoryList.innerHTML = markup;
};