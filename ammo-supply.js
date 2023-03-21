const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const url = `https://www.ammosupplywarehouse.com/index.php?main_page=index&cPath=1`;

var rifles = {};

// var everthing = {};

async function getHTML() {
  const { data: html } = await axios.get(url);
  return html;
}

getHTML().then((res) => {
  const $ = cheerio.load(res);
  /*Handgun Ammo*/
  //Sub categories
  $("ul>.categoryListBoxContents").each((i, guns) => {
    const magazines = $(guns).find("a").text();
    const image = $(guns).find("a img").attr("src");
    const price = $(guns).find("span").text();
    //updating handguns object
    if (rifles.hasOwnProperty(i + 1)) {
      rifles[Object.keys(rifles).length + 1] = { magazines, image, price };
    } else {
      rifles[i + 1] = { magazines, image, price };
    }

    //updating handguns object
    rifles[i + 1] = { magazines, image, price };
    // console.log(rifles);
  });
  //New products for march
  $("ul>.centerBoxContentsNew").each((i, guns) => {
    const magazines = $(guns).find("a").text();
    const image = $(guns).find("a img").attr("src");
    const price = $(guns).find("span").text();
    //updating handguns object
    if (rifles.hasOwnProperty(i + 1)) {
      rifles[Object.keys(rifles).length + 1] = { magazines, image, price };
    } else {
      rifles[i + 1] = { magazines, image, price };
    }
  });
  //Featured products
  $("ul>.centerBoxContentsFeatured").each((i, guns) => {
    const magazines = $(guns).find("a").text();
    const image = $(guns).find("a img").attr("src");
    const price = $(guns).find("span").text();
    //updating handguns object
    if (rifles.hasOwnProperty(i + 1)) {
      rifles[Object.keys(rifles).length + 1] = { magazines, image, price };
    } else {
      rifles[i + 1] = { magazines, image, price };
    }
  });

  fs.writeFile("handguns.json", JSON.stringify(rifles, null, 2), (err) => {
    if (err) throw err;
    console.log("file succesfully saved!");
  });
});
