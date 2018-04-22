# BTC Price Check

BTC Price Check is a small project to help me learn JavaScript. It uses the CoinDesk API to retrieve the value of a Bitcoin in various currencies.

## To Do

- [ ] Clean up the existing code
  - [x] Figure out the proper way to process histPrice from json
  - [x] Replace unnecessary element variables with inline dqs
  - [x] Move various currency variables into an object
  - [ ] Improve data attributes in HTML
  - [ ] Improve variable names
  - [x] Simplify percentage change code
- [ ] Build a better currency picker
  - [ ] Use the CoinDesk supported currencies json to build a searchable currency menu, retrieve currency code and currency long name
  - [ ] Map currency codes to currency symbols
- [x] Build a quote rotator
  - [x] Collect a bunch of Bitcoin quotes and load one at random
- [ ] Currency converter
  - [ ] Build a converter that uses the current price to calculate the value of custom amounts in BTC / fiat pairs
  - [ ] Build a switcher button that flips the pairs
- [ ] Add other currencies
  - [ ] Include ETH, LTC, etc
  - [ ] CoinDesk doesn't provide this information, find another way
- [ ] Cross-crypto conversion
  - [ ] Upgrade the currency converter to calculate between crypto/crypto pairs
- [ ] Historical price comparison improvements
  - [ ] Select custom history intervals, or presets (1mo, 6mo, 1y, etc)
  - [ ] Build graphs and charts for data over time
  - [ ] Overlay different historical charts to track trends (ie BTC/USD vs ETH/USD)
