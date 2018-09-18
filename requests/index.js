const url = require('url');
const request = require('request');
const cheerio = require('cheerio');

module.exports.startCrawler = async function (
  requestPath,
  requestHandler,
) {
  const location = url.parse(requestPath);
  const href = location.href;

  const body = await sendRequest(href);
  const $body = cheerio.load(body);

  return requestHandler($body)
}

function sendRequest(href) {
  return new Promise((resolve, reject) => {
    let DataBuffer;

    request.get(href)
    .on('response', function onResponse(response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type']) // 'image/png'
    })
    .on('data', function onData(data) {
      DataBuffer += data
    })
    .on('end', function onEnd() {
      resolve(DataBuffer)
    })
    .on('error', function onError(error) {
      console.log('error====================================');
      console.log(error);
      console.log('error====================================');
      throw error;
    });
  });
}