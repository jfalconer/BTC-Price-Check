'use strict';

const dqs = (query) => document.querySelector(query);
const dqsa = (query) => document.querySelectorAll(query);
const apiBase = 'https://api.coindesk.com/v1/bpi/';

let cryptoQuotes = [
  ["We have elected to put our money and faith in a mathematical framework that is free of politics and human error.", "Tyler Winklevoss"],
  ["I think the internet is going to be one of the major forces for reducing the role of government. The one thing that’s missing but that will soon be developed, is a reliable e-cash.", "Milton Friedman"],
  ["Bitcoin is a technological tour de force.", "Bill Gates"]
];
let currencyInfo = [
  ["AUD", "$", "Australian dollars", "au"],
  ["USD", "$", "United States dollars", "us"],
  ["CAD", "$", "Canadian dollars", "ca"],
  ["CNY", "¥", "Chinese yuan", "cn"],
  ["CHF", "Fr.", "Swiss francs", "ch"],
  ["EUR", "€", "Euros", "eu"],
  ["GBP", "£", "Great Britain pounds", "gb"],
  ["RUB", "₽", "Russian rubles", "ru"],
  ["BRL", "R$", "Brazilian real", "br"]
];

// create currency picker dropdown
for (let i = 0; i < currencyInfo.length; i++) {
  dqs('.currency-selection').innerHTML += `<a data-currency="${i}" class="dropdown-item" href="#"><span class="flag-icon flag-icon-${currencyInfo[i][3]}"></span>&nbsp;&nbsp;${currencyInfo[i][0]}</a>`;
}

document.addEventListener('DOMContentLoaded', function () {

  dqsa('.currency-buttons .dropdown-item').forEach(getPrice => getPrice.addEventListener('click', getBtcData));
  let cryptoQuoteIndex = Math.floor(Math.random() * cryptoQuotes.length);
  dqs('#quote-text').innerHTML = `\"${cryptoQuotes[cryptoQuoteIndex][0]}\"`;
  dqs('#quote-source').innerHTML = `${cryptoQuotes[cryptoQuoteIndex][1]}`;

});

function Currency (currencyCode, currencySymbol, currencyName, countryCode) {
  this.code = currencyCode;
  this.symbol = currencySymbol;
  this.name = currencyName;
  this.flag = countryCode;
}

Currency.prototype = {
  getTodaysPrice: function () {
    return axios.get(`${apiBase}currentprice/${this.code}.json`);
  },
  getYesterdaysPrice: function () {
    return axios.get(`${apiBase}historical/close.json?currency=${this.code}&for=yesterday`);
  }
}

function getBtcData (e) {

  let yourCurrency = new Currency(
                              currencyInfo[e.target.dataset.currency][0],
                              currencyInfo[e.target.dataset.currency][1],
                              currencyInfo[e.target.dataset.currency][2],
                              currencyInfo[e.target.dataset.currency][3]
                            );

  axios.all([yourCurrency.getTodaysPrice(), yourCurrency.getYesterdaysPrice()])
  .then(axios.spread(function (current, yesterday) {
    let price = Number(current.data.bpi[yourCurrency.code].rate.replace(',','')).toFixed(2);
    let yesterdayDate = Object.keys(yesterday.data.bpi);
    let histPrice = yesterday.data.bpi[yesterdayDate[0]];
    let pricePcntChange = ((price - histPrice) / price * 100).toFixed(2);

    // display the content
    dqs('#price').innerHTML = `<p>The current price of a Bitcoin in <span class="flag-icon flag-icon-${yourCurrency.flag}"></span> ${yourCurrency.name} is <strong>${yourCurrency.symbol}${Number(price).toLocaleString()}</strong>.</p>`;
    dqs('#historical-price').innerHTML = `<p>Yesterday, the price was <strong>${yourCurrency.symbol}${Number(histPrice).toLocaleString()}</strong>.</p>`;
    if (pricePcntChange > 0) {
      dqs('#price-change').innerHTML = `Since then, its value has grown by <span id="price-change-pcnt" class="pcnt-up-text">${pricePcntChange}%</span>. Make it rain!`;
    }
    else if (pricePcntChange < 0) {
      dqs('#price-change').innerHTML = `Since then, its value has decreased by <span id="price-change-pcnt" class="pcnt-down-text">${pricePcntChange}%</span>. The end is near!`;
    }
  }));
}
