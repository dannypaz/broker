const bigInt = require('big-integer')

/**
 * @class Model representing Block Orders
 */
class BlockOrder {
  /**
   * Instantiate a new Block Order
   * @param  {String} options.id          Unique id for the block order
   * @param  {String} options.marketName  Market name (e.g. BTC/LTC)
   * @param  {String} options.side        Side of the market being taken (i.e. BID or ASK)
   * @param  {String} options.amount      Size of the order in base currency (e.g. '10000')
   * @param  {String} options.price       Limit price for the order (e.g. '100.1')
   * @param  {String} options.timeInForce Time restriction on the order (e.g. GTC, FOK)
   * @return {BlockOrder}
   */
  constructor ({ id, marketName, side, amount, price, timeInForce }) {
    this.id = id
    this.marketName = marketName
    this.side = side
    this.amount = bigInt(amount)
    this.price = price ? bigInt(price) : null
    this.timeInForce = timeInForce
  }

  /**
   * Convenience getter for baseSymbol
   * @return {String} Base symbol from market name (e.g. BTC from BTC/LTC)
   */
  get baseSymbol () {
    return this.marketName.split('/')[0]
  }

  /**
   * Convenience getter for counterSymbol
   * @return {String} Counter symbol from market name (e.g. LTC from BTC/LTC)
   */
  get counterSymbol () {
    return this.marketName.split('/')[1]
  }

  /**
   * get key for storage in leveldb
   * @return {String} Block order id
   */
  get key () {
    return this.id
  }

  /**
   * get value for storage in leveldb
   * @return {String} Stringified JSON object
   */
  get value () {
    const { marketName, side, amount, price, timeInForce } = this

    return JSON.stringify({
      marketName,
      side,
      amount: amount.toString(),
      price: price ? price.toString() : null,
      timeInForce
    })
  }

  /**
   * Re-instantiate a previously saved BlockOrder
   * @param  {String} key   Key used to retrieve the BlockOrder
   * @param  {String} value Value returned from leveldb
   * @return {BlockOrder}   BlockOrder instance
   */
  static fromStorage (key, value) {
    const { marketName, side, amount, price, timeInForce } = JSON.parse(value)
    const id = key

    return new this({ id, marketName, side, amount, price, timeInForce })
  }
}

module.exports = BlockOrder