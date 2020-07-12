const cheerio = require("cheerio");
const superagent = require("superagent");
const https = require("https");
const fs = require("fs");
const tinify = require("tinify");

// tinify api key
// https://tinypng.com/developers
tinify.key = "your key here";

// 访问https://www.countryflags.com/en/
// 遍历获取所有的国旗
// 打开国旗详情页，获取国旗对应的缩写
// 下载对应国旗的资源，根据国旗缩写重命名，统一放到flag目录下

(async function getData() {
  const homePageUrl =
    "https://data.countryflags.com/products/en/category/2979382/tiles/population-desc.html";
  const homePageResp = await superagent.get(homePageUrl);
  const $home = cheerio.load(homePageResp.text);
  const hrefs = $home(".grid-thumbs").find(".thumbnail a");
  const promiseCalls = [];
  const files = [];
  const pictureSaveDir = "flag";

  if (!fs.existsSync(pictureSaveDir)) {
    fs.mkdirSync(pictureSaveDir);
  }

  Array.from(hrefs).forEach(h => {
    const promise = new Promise(async function(resolve) {
      // 返回的url类似 '//www.countryflags.com/en/flag-of-china.html'， 需要去除前面的两个//
      const href = $home(h).attr("href");
      const flagPage = await superagent.get(href.slice(2));
      const $flagPage = cheerio.load(flagPage.text);
      const emojiDownloadHref = $flagPage(
        ".download-list li:nth-child(3) a"
      ).attr("href");
      const countryName = emojiDownloadHref.match(/.*en\/(.*)-flag-icon.*/)[1];
      // internetTLD 是对应的国家编码
      // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
      const internetTLD = $flagPage(
        ".col-xs-24.col-sm-12.col-md-6 .panel table tr:first-child td"
      )[1].childNodes[0].data;
      const downloadUrl = `https://cdn.countryflags.com/thumbs/${countryName}/flag-400.png`;

      // directly download
      const fileName = `${internetTLD}.png`;
      const file = fs.createWriteStream(`${pictureSaveDir}/${fileName}`);

      files.push(fileName);

      https.get(downloadUrl, function(response) {
        response.pipe(file);

        console.log(`download ${internetTLD} done!`);

        resolve();
      });
    });

    promiseCalls.push(promise);
  });

  // 直接下载
  Promise.all(promiseCalls)
    .then(() => {
      console.log("download finish!");
    })
    .catch(e => {
      console.log(e);
    });

  // 下载完使用tinify对图片大小进行优化，减小图片大小
  /*
  Promise.all(promiseCalls).then(() => {
    console.log("download finish!");
    console.log("start optimized:");
    files.forEach(async f => {
      console.log(`>>>>>>>>>>>>>>>> optimized ${f}`);
      const source = tinify.fromFile(`flag-source/${f}`);
      try {
        source.toFile(`flag-compress/${f}`);
      } catch (e) {
        console.log(e);
        console.log(f);
      }
    });
  });
  */
})();
