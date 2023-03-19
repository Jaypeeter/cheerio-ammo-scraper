const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const url = `https://www.federalpremium.com/shotshell/`;

// Gold Medal
// HammerDown
// Premium Handgun Hunting
// Premium Personal Defense
// Federal Personal Defense
// American Eagle
// Federal Target
// Fusion
// Power-Shok
// Syntech

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
  $(".product>.product-tile").each((i, guns) => {
    const item = $(guns).find("h6 a").text();
    const image = $(guns).find("img").attr("src");
    const price = $(guns).find(".sales .value").text();
    const link = $(guns).find("a").attr("href");
    const rows = $(guns).find(".tile-attributes li");
    var specs = {};
    // console.log("Specs before starting", specs);

    // console.log(rows);

    rows.each((index, element) => {
      var label = $(".label-3", element).text();
      var value = $(".label-2", element).text();

      specs[label] = value;
    });

    //updating handguns object
    rifles[i + 1] = { item, image, price, link, specs };
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

  fs.writeFile("shotshell.json", JSON.stringify(rifles, null, 2), (err) => {
    if (err) throw err;
    console.log("file succesfully saved!");
  });
});
