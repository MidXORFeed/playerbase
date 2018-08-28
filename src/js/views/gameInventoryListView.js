import { elements } from '../playerbase'

export const renderInventoryList = (inventoryList, AssetPriceData) => {
    let markup = ``;
    if (inventoryList) {
        inventoryList.forEach(element => {
            const icon_url = `https://steamcommunity-a.akamaihd.net/economy/image/${element.icon_url}`;
            markup += 
            `<li id="${element.appid}_${element.classid}">
                <img src="${icon_url}" class="game_inventoryItem"></img>
                <span>${element.name}</span>
            </li>`

            /* Display only items sold by Steam at retail Price (NOT COMMUNITY PRICE)
            if (AssetPriceData[element.classid]) {
                const icon_url = `https://steamcommunity-a.akamaihd.net/economy/image/${element.icon_url}`;
                markup += 
                `<li id="${element.appid}_${element.classid}">
                    <img src="${icon_url}" class="game_inventoryItem"></img>
                    <span>${element.name}</span>
                    <span>${AssetPriceData[element.classid]}</span>
                </li>`
            }
            */
        });
    } else {
        markup = `You have no steam items for this specific game!`;
    }
    elements.gameInventoryList.innerHTML = markup;
};