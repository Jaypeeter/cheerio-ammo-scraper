const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");

fs.readFile("./magazines.json", "utf8", async (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err.message);

    return;
  }

  const subCategories = {};
  var everything = {};

  var listOfData = JSON.parse(jsonString);

  var keys = Object.keys(listOfData);

  for (let key of keys) {
    if (listOfData[key].hasOwnProperty("url")) {
      //Continue writing the code here based on the url
      const url = listOfData[key].url;
      console.log(url);

      async function getHTML() {
        const { data: html } = await axios.get(url);
        return html;
      }

      var res = await getHTML();
      // console.log(res);

      const $ = cheerio.load(res);
      //Sub categories
      $(".product_list>li").each((i, guns) => {
        //   $("ul>.categoryListBoxContents").each((i, guns) => {
        // const items = $(guns).find("a span").text();
        // const image = $(guns).find("a img").attr("src");
        // const price = $(guns).find("a").attr("href");
        const items = $(guns).find("h5>.product-name").text();
        const image = $(guns).find("a img").attr("src");
        const price = $(guns).find(".content_price .productBasePrice").text();

        //updating handguns object
        subCategories[i + 1] = { items, image, price };
      });

      everything[listOfData[key].magazines] = subCategories;
    }
  }

  fs.writeFile(
    `magazines-subcategory.json`,
    JSON.stringify(everything, null, 2),
    (err) => {
      if (err) throw err;
      console.log("file succesfully saved!");
    }
  );
});
