'use strict';

const dqs = (query) => document.querySelector(query);
const dqsa = (query) => document.querySelectorAll(query);
const apiBase = 'https://api.coindesk.com/v1/bpi/';

let cryptoQuotes = [
  ["We have elected to put our money and faith in a mathematical framework that is free of politics and human error.", "Tyler Winklevoss"],
  ["I think the internet is going to be one of the major forces for reducing the role of government. The one thing that’s missing but that will soon be developed, is a reliable e-cash.", "Milton Friedman"],
  ["Bitcoin is a technological tour de force.", "Bill Gates"],
  ["Cryptocurrency is such a powerful concept that it can almost overturn governments.", "Charles Lee"],
  ["Cryptography shifts the balance of power from those with a monopoly on violence to those who comprehend mathematics and security design.", "Jacob Appelbaum"],
  ["Bitcoin will do to banks what email did to the postal industry.", "Rick Falkvinge"],
  ["Someday consumers and businesses won’t hold Bitcoins for their account but will unknowingly access the Bitcoin network whenever payments are made.", "Paul Vigna"],
  ["I think the fact that within the Bitcoin universe an algorithm replaces the functions of the government is actually pretty cool. I am a big fan of Bitcoin.", "Al Gore"]
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

class Currency {
  constructor(currencyCode, currencySymbol, currencyName, countryCode) {
    this.code = currencyCode;
    this.symbol = currencySymbol;
    this.name = currencyName;
    this.flag = countryCode;
  }
  getTodaysPrice() {
    return axios.get(`${apiBase}currentprice/${this.code}.json`);
  }
  getYesterdaysPrice() {
    return axios.get(`${apiBase}historical/close.json?currency=${this.code}&for=yesterday`);
  }
}

class HistoricalData {
  constructor(price, date, change) {
    this.price = price;
    this.date = date;
    this.change = change;
  }
}

let worldBank = {};

function getBtcData (e) {
  let fiat = currencyInfo[e.target.dataset.currency][0];
  worldBank[fiat] = new Currency(
                              fiat,
                              currencyInfo[e.target.dataset.currency][1],
                              currencyInfo[e.target.dataset.currency][2],
                              currencyInfo[e.target.dataset.currency][3]
                            );

  let yourCurrency = worldBank[fiat];

  axios.all([yourCurrency.getTodaysPrice(), yourCurrency.getYesterdaysPrice()])
  .then(axios.spread(function (current, yesterday) {
    // find price data and calculate daily % change
    yourCurrency.thisDay = current.data.time.updatedISO.substring(0, 10); console.log(yourCurrency.thisDay);
    yourCurrency.currentPrice = Number(current.data.bpi[yourCurrency.code].rate_float);
    yourCurrency.yesterdayDate = Object.keys(yesterday.data.bpi);
    yourCurrency.historicalPrice = yesterday.data.bpi[yourCurrency.yesterdayDate[0]];
    yourCurrency.pricePcntChange = ((yourCurrency.currentPrice - yourCurrency.historicalPrice) / yourCurrency.currentPrice * 100).toFixed(2);
    // first steps towards writing historical data in a json file for charting
    worldBank[fiat][yourCurrency.thisDay] = new HistoricalData(yourCurrency.currentPrice, yourCurrency.thisDay, yourCurrency.pricePcntChange);
    console.log(worldBank.AUD["2018-04-23"]);

    // display the content
    dqs('#price').innerHTML = `<p>The current price of a Bitcoin in <span class="flag-icon flag-icon-${yourCurrency.flag}"></span> ${yourCurrency.name} is <strong>${yourCurrency.symbol}${Number(yourCurrency.currentPrice.toFixed(2)).toLocaleString()}</strong>.</p>`;
    dqs('#historical-price').innerHTML = `<p>Yesterday, the price was <strong>${yourCurrency.symbol}${Number(yourCurrency.historicalPrice.toFixed(2)).toLocaleString()}</strong>.</p>`;
    if (yourCurrency.pricePcntChange > 0) {
      dqs('#price-change').innerHTML = `Since then, its value has grown by <span id="price-change-pcnt" class="pcnt-up-text">${yourCurrency.pricePcntChange}%</span>. Make it rain!`;
    }
    else if (yourCurrency.pricePcntChange < 0) {
      dqs('#price-change').innerHTML = `Since then, its value has decreased by <span id="price-change-pcnt" class="pcnt-down-text">${yourCurrency.pricePcntChange}%</span>. The end is near!`;
    }


  }));


}
