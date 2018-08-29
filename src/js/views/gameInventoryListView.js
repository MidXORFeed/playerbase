import { elements } from '../playerbase'

export const clearGamesList = () => {
    elements.gameInventoryList.innerHTML = '';
};

export const renderInventoryList = (inventoryList, AssetPriceData) => {
    const tableHeaderMarkup = 
    `
    <tr>
        <th></th>
        <th>NAME</th>
        <th>QUANTITY</th>
        <th>CURRENT</th>
        <th>LOW</th>
        <th>HIGH</th>
        <th>RETAIL</th>
    </tr>
    `;
    let markup = tableHeaderMarkup;

    if (inventoryList) {
        inventoryList.forEach(element => {
            const icon_url = `https://steamcommunity-a.akamaihd.net/economy/image/${element.icon_url}`;
            markup += 
            `
            <tr id="${element.appid}_${element.classid}">
                <td><img src="${icon_url}" class="game_inventoryItem"></img></td>
                <td>${element.name}</td>
                <td>2</td>
                <td>1.79</td>
                <td>0.01</td>
                <td>10.99</td>
                <td>14.99</td>
            </tr>
            `
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