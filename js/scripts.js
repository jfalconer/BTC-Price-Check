'use strict';

const dqs = (query) => document.querySelector(query);
const dqsa = (query) => document.querySelectorAll(query);

document.addEventListener('DOMContentLoaded', function () {
  dqsa('.currency-buttons .dropdown-item').forEach(getPrice => getPrice.addEventListener('click', getBtcData));
});

const apiBase = 'https://api.coindesk.com/v1/bpi/';

function getCurrentPrice(currency) {
  return axios.get(`${apiBase}currentprice/${currency.code}.json`);
}

function getYesterdaysPrice(currency) {
  return axios.get(`${apiBase}historical/close.json?currency=${currency.code}&for=yesterday`);
}

function getBtcData (e) {

  const currency = {
    code: e.target.dataset.currency,
    signature: e.target.dataset.crncysig,
    longName: e.target.dataset.crnclongname,
  };

//  const currency = e.target.dataset.currency;
//  const crncSig = e.target.dataset.crncysig;
//  const crncLongName = e.target.dataset.crnclongname;

  axios.all([getCurrentPrice(currency.code), getYesterdaysPrice(currency.code)])
  .then(axios.spread(function (current, yesterday) {
    let price = Number(current.data.bpi[currency.code].rate.replace(',','')).toFixed(2);
    let yesterdayDate = Object.keys(yesterday.data.bpi);
    let histPrice = yesterday.data.bpi[yesterdayDate[0]];
    let pricePcntChange = ((price - histPrice) / price * 100).toFixed(2);

    // display the content
    dqs('.price').innerHTML = `<p>The current price of a Bitcoin in ${currency.longName} is <strong>${currency.signature}${price}<strong>.</p>`;
    dqs('.historical-price').innerHTML = `<p>Yesterday, the price was <strong>${currency.signature}${histPrice}</strong>.</p>`;
    dqs('.price-change').innerHTML = `<span class="price-change-pcnt">${pricePcntChange}%</span>`;
    if (pricePcntChange > 0) {
      dqs('.price-change-context').innerHTML = `Since then, its value has grown by `;
      dqs('.price-change').classList.add('pcnt-up-text');
      dqs('.price-change-append').innerHTML = ` - make it rain!`;
    }
    else if (pricePcntChange < 0) {
      dqs('.price-change-context').innerHTML = `Since then, its value has decreased by `;
      dqs('.price-change').classList.add('pcnt-down-text');
      dqs('.price-change-append').innerHTML = ` - good time to buy!`;
    }
  }));
}
