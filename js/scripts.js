'use strict';

const dqs = (query) => document.querySelector(query);
const dqsa = (query) => document.querySelectorAll(query);

document.addEventListener('DOMContentLoaded', function () {
  const getPriceBtns = dqsa('.currency-buttons .dropdown-item');
  getPriceBtns.forEach(getPrice => getPrice.addEventListener('click', getBtcData));
  console.log(getPriceBtns.length);
});

const apiBase = 'https://api.coindesk.com/v1/bpi/';

function getCurrentPrice(currency) {
  return axios.get(`${apiBase}currentprice/${currency}.json`);
}

function getYesterdaysPrice(currency) {
  return axios.get(`${apiBase}historical/close.json?currency=${currency}&for=yesterday`);
}

function showData(){}

function getBtcData (e) {
  const currency = e.target.dataset.currency;
  const crncSig = e.target.dataset.crncysig;
  const crncLongName = e.target.dataset.crnclongname;

  axios.all([getCurrentPrice(currency), getYesterdaysPrice(currency)])
  .then(axios.spread(function (current, yesterday) {
    let displayPrice = dqs('.price');
    let displayHistPrice = dqs('.historical-price');
    let displayPriceChange = dqs('.price-change');
    let displayPriceChangeContext = dqs('.price-change-context');
    let displayPriceChangeAppend = dqs('.price-change-append');
    let price = Number(current.data.bpi[currency].rate.replace(',','')).toFixed(2);

    // messy hist price code
    let histPriceData = JSON.stringify(yesterday.data.bpi);
    let histPriceArray = histPriceData.split(':');
    let histPriceString= histPriceArray[1];
    let histPrice = Number(histPriceString.substring(0, histPriceString.length - 1)).toFixed(2);
    console.log(histPrice);

    let pricePcntChange = ((price - histPrice) / price * 100).toFixed(2);

    // display the content
    displayPrice.innerHTML = `<p>The current price of a Bitcoin in ${crncLongName} is <strong>${crncSig}${price}<strong>.</p>`;
    displayHistPrice.innerHTML = `<p>Yesterday, the price was <strong>${crncSig}${histPrice}</strong>.</p>`;
    displayPriceChange.innerHTML = `<span class="price-change-pcnt">${pricePcntChange}</span>`;
    if (pricePcntChange > 0) {
      displayPriceChangeContext.innerHTML = `Since then, its value has grown by `;
      displayPriceChange.classList.add('pcnt-up-text');
      displayPriceChangeAppend.innerHTML = `% - make it rain!`;
    }
    else if (pricePcntChange < 0) {
      displayPriceChangeContext.innerHTML = `Since then, its value has decreased by `;
      displayPriceChange.classList.add('pcnt-down-text');
      displayPriceChangeAppend.innerHTML = `% - good time to buy!`;
    }
  }));
}
