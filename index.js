var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var Promise = require('bluebird')
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
let i = 10000;
const url = `/content/meiju22369.html`
const httpd = Promise.promisifyAll(request)



async function feach(url) {
  url = `http://www.meijutt.com${url}?P_AVPASS=PHDGBITAVPASST`
  /* let res=  await  httpd.getAsync(url) */
  download(url, (data) => {

    let $ = cheerio.load(data);
    const length = $(".down_list li").length;
    const title = $(".info-title h1").text();
    console.log(title)
    let x = [];
    for (let i = 0; i < length; i++) {
      const name = $($(".down_list li")[i]).find("input").attr("file_name");
      const src = $($(".down_list li")[i]).find("input").attr("value")
      x.push({ name, src })
    }
    let string =[]
    x.map(item=>{
      string.push(`name:${item.name} ===============> src: ${item.src}\r\n`);
    }) 
    fs.appendFile('./data/' + title + '.txt', string, 'utf-8', function (err) {
      if (err) {
        console.log(err);
      }
       feach($($(".c1_l_wap_contact li p a")[0]).attr('href'))
    });
  })

}

function download(url, callback) {
  http.get(url, function (res) {

    var bufferHelper = new BufferHelper();

    res.on('data', function (chunk) {
      bufferHelper.concat(chunk);
    });
    res.on("end", function () {
      callback(iconv.decode(bufferHelper.toBuffer(), 'GBK'));
    });
  }).on("error", function () {
    callback(null);
  });
}
feach(url);