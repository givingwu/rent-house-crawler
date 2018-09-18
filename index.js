const fs = require('fs');
const { resolve } = require('path');
const { stringify, fileLog, makeFileExist } = require('./utils')
const requests = require('./requests');
const dataFilter = require('./filters/filter58')
const { url, maxDataSize } = require('./config')


const results = []

/**
 * 开始调用爬虫
 * @param {String}    url
 * @param {Function}  bodyHandler   cheerio instance
 */
requests.startCrawler(url, function bodyHandler($) {
  // DOM 解析
  const list = $('.listUl > li')

  if (list && list.length) {
    const elements = list.filter(function(i) {
      return $(this).children('.des').length
    })

    console.log('length====================================');
    console.log(list.length, elements.length, results.length);
    console.log('====================================');

    elements.map(function handler(i) {
      const imgNode = $(this).children('.img_list')
      const img = imgNode.find('a > img').attr('src')

      const descNode = imgNode.next()
      const headNode = descNode.children('h2')
      const link = headNode.children('a').attr('href')
      const title = headNode.text().replace(/\s/g, '')

      const roomNode = headNode.next()
      const room = roomNode.text().split(/\s/g).filter(t => t)

      const addrNode = roomNode.next()
      const addr = addrNode.text().split(/\s/g).filter(t => t)

      const fromNode = addrNode.next()
      const from = fromNode.text().split(/\s/g).filter(t => t)

      const rightNode = descNode.next()
      const time = rightNode.children('.sendTime').text().replace((/\s/g), '')
      const prize = rightNode.children('.money').text().replace((/\s/g), '')

      const newItem = {
        title,
        img,
        link,
        room,
        addr,
        from,
        prize,
        time,
      }

      results.push(newItem)

      console.log('====================================');
      console.log(results.length, ':', newItem);
      console.log('====================================');

      if (results.length <= maxDataSize) {
        if (i === elements.length - 1) {
          // 触发翻页，尾递归
          const url = $('#bottom_ad_li .next').attr('href')
          return requests.startCrawler(url, bodyHandler)
        }
      } else {
        return geneRecordsLog()
      }
    })
  } else {
    return geneRecordsLog()
  }
})


/**
 * 生成 .log 文档
 * @param {Array} results
 */
const geneRecordsLog = function() {
  let recordsPath = resolve(__dirname, './records/records.log')
  let filterRecordsPath = resolve(__dirname, './records/filter_records.log')

  if (!fs.existsSync(recordsPath)) {
    makeFileExist(recordsPath)
  }

  if (!fs.existsSync(filterRecordsPath)) {
    makeFileExist(filterRecordsPath)
  }

  let records = fs.createWriteStream(recordsPath)
  let filterRecords = fs.createWriteStream(filterRecordsPath)

  records.write(stringify(results), () => fileLog(recordsPath))
  filterRecords.write(stringify(dataFilter(results)), () => {
    fileLog(filterRecordsPath)
    process.exit()
  })
}
