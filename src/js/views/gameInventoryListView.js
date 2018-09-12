import { elements } from '../playerbase'
import Chart from 'chart.js'

export const clearInventoryList = () => {
    elements.gameInventoryList.innerHTML = '';
};

export const unrenderRecentItemSalesInfoChart = (marketHashName) => {
    let itemDOM = document.getElementById(`${marketHashName}`);
    if (itemDOM.classList.contains('inventory__item-showmore')) {
        itemDOM.classList.replace('inventory__item-showmore', 'inventory__item-showless');
        itemDOM.firstElementChild.textContent = "SHOW MORE INFO";
    }
}

export const renderRecentItemSalesInfoChart = (marketHashName, recentItemSalesInfo) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let priceData = [];
    let soldDateData = [];
    if (recentItemSalesInfo) {
        recentItemSalesInfo.reverse().forEach( element => { 
            let currentDate = new Date(element.sold_at * 1000);
            priceData.push(element.price);
            soldDateData.push(`${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()}`);    
        });
    }

    let itemDOM = document.getElementById(`${marketHashName}`);
    if (itemDOM.classList.contains('inventory__item-showless')) {
        itemDOM.classList.replace('inventory__item-showless', 'inventory__item-showmore');
        let markup = `<td colspan="7"><canvas id="${marketHashName}__salesInfo"></canvas></td>`;
        itemDOM.firstElementChild.innerHTML = markup;
        var ctx = document.getElementById(`${marketHashName}__salesInfo`);
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: soldDateData,
                datasets: [{
                    label: `${marketHashName} Value`,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: priceData,
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Price (USD)'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: false,
                            labelString: 'Date Sold'
                        }
                    }]
                }
            }
        });
    }
}

export const renderResults = (inventory, allItemPrices, priceDataForItemsOnSale, page = 1, resPerPage = 10) => {
    // render results of currente page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    
    if (inventory !== undefined) {
        renderInventoryTableHeader();
        inventory.slice(start, end).forEach( item => { renderItemRow(item, allItemPrices[item.market_hash_name], priceDataForItemsOnSale[item.market_hash_name]) });
        renderTotalInventoryValues(inventory.totals);
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

const renderTotalInventoryValues = (inventoryTotals) => {
    const tableFooterMarkup = 
    `
    <tr>
        <td></td> 
        <td></td>
        <td></td>
        <td>TOTAL VALUES</td>
        <td>${inventoryTotals !== undefined ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inventoryTotals.lowTotal) : '---' }</th>
        <td>${inventoryTotals !== undefined ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inventoryTotals.currentTotal) : '---' }</th>
        <td>${inventoryTotals !== undefined ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inventoryTotals.suggestedTotal) : '---' }</th>
    </tr>
    `;
    elements.gameInventoryList.insertAdjacentHTML('beforeend', tableFooterMarkup);
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

const renderInventoryTableHeader = () => {
    const tableHeaderMarkup = 
    `
    <tr>
        <th></th> 
        <th>NAME</th>
        <th>RARITY</th>
        <th>QUANTITY</th>
        <th>LOW</th>
        <th>CURRENT</th>
        <th>SUGGESTED</th>
    </tr>
    `;
    elements.gameInventoryList.insertAdjacentHTML('afterbegin', tableHeaderMarkup);
}

const renderNoItemsFound = () => {
    const markup = `You have no steam items for this specific game!`;
    elements.gameInventoryList.insertAdjacentHTML('afterbegin', markup);
}

const renderItemRow = (inventoryItem, itemPrice, priceData) => {
    const markup = `
    <tr id="${inventoryItem.app_id}_${inventoryItem.class_id}">
        <td><img src="${inventoryItem.image}" class="game_inventoryItem" style="border-color: #${itemPrice !== undefined && itemPrice.name_color !== undefined ? itemPrice.name_color : ''}"></img></td>
        <td style="color: #${itemPrice !== undefined && itemPrice.name_color !== undefined ? itemPrice.name_color : ''} ">${inventoryItem.market_hash_name}</td>
        <td style="color: #${itemPrice !== undefined && itemPrice.rarity_color !== undefined ? itemPrice.rarity_color : ''} ">${inventoryItem !== undefined && inventoryItem.item_rarity !== null ? inventoryItem.item_rarity : '---' }</td>
        <td>${inventoryItem.number_of_items}</td>
        <td>${priceData !== undefined && priceData.lowest_price !== undefined ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceData.lowest_price) : '---' }</td>
        <td>${itemPrice !== undefined && itemPrice.current_price !== undefined ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(itemPrice.current_price) : '---' }</td>
        <td>${inventoryItem !== undefined && inventoryItem.suggested_price !== undefined ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inventoryItem.suggested_price) : '---' }</td>
        <tr id="${inventoryItem.market_hash_name}" class="inventory__item inventory__item-showless" colspan="7">
            <td colspan="7" style="text-align: center">SHOW MORE INFO</td>
        </tr>
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