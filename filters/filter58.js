const { maxRentMoney } = require('../config')

/**
 * 筛选数据
 * @param {*} results
 */

// 筛选价格在 1000 以下的数据
module.exports = function filter(list) {
  return Array.isArray(list) ? list.filter(t => {
  	return t && typeof t === 'object' && t.prize ? +(/\d*/.exec(t.prize)[0]) <= maxRentMoney : false
  }) : ''
}