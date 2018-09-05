import { elements } from '../playerbase'

export const clearInventoryList = () => {
    elements.gameInventoryList.innerHTML = '';
};

export const renderResults = (inventory, gameAssetPrices, page = 1, resPerPage = 10) => {
    // render results of currente page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    if (inventory !== undefined) {
        renderItemHeader();
        inventory.slice(start, end).forEach( element => { renderItemRow(element, gameAssetPrices[element.market_hash_name]) });
        renderPaginationButtons(page, inventory.length, resPerPage);
    } else {
        renderNoItemsFound();
    }
};

export const renderDisplayQuantityButtons = (inventory) => {
    let markup = ``;
    if (inventory) {        
        if (inventory.length > 50) {
            markup += `<button class="btn btn-display10">Show 10</button>`;
            markup += `<button class="btn btn-display50">Show 50</button>`;
        }
    
        if (inventory.length > 100) {
            markup += `<button class="btn btn-display100">Show 100</button>`;
        }

        if (inventory.length > 10) {
            markup += `<button class="btn btn-displayAll">Show All</button>`;
        }

        elements.gameInventoryList.insertAdjacentHTML('afterbegin', markup);
    }
}

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderItemHeader = () => {
    const tableHeaderMarkup = 
    `
    <tr>
        <th></th> 
        <th>NAME</th>
        <th>QUANTITY</th>
        <th>CURRENT</th>
    </tr>
    `;
    elements.gameInventoryList.insertAdjacentHTML('afterbegin', tableHeaderMarkup);
}

const renderNoItemsFound = () => {
    const markup = `You have no steam items for this specific game!`;
    elements.gameInventoryList.insertAdjacentHTML('afterbegin', markup);
}

const renderItemRow = (element, price) => {
    const markup = `
    <tr id="${element.appid}_${element.classid}">
        <td><img src="${element.image}" class="game_inventoryItem"></img></td>
        <td>${element.market_hash_name}</td>
        <td>${element.number_of_items}</td>
        <td>${price !== undefined ? '$ ' + price : '---'}</td>
    </tr>
    `;
    elements.gameInventoryList.insertAdjacentHTML('beforeend', markup);
};

const renderPaginationButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    } else {
        // Only 1 page of items, no need to render next page
        return;
    }
    elements.gameInventoryList.insertAdjacentHTML('beforeend', button);
};