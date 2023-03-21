const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");

let x = 12 * 30;

for (let i = 12; i < x; i += 12) {
  const url = `https://www.federalpremium.com/on/demandware.store/Sites-VistaFederal-Site/default/Search-UpdateGrid?cgid=Rifle&start=${i}&sz=12&selectedUrl=https%3A%2F%2Fwww.federalpremium.com%2Fon%2Fdemandware.store%2FSites-VistaFederal-Site%2Fdefault%2FSearch-UpdateGrid%3Fcgid%3DRifle%26start%3D${i}%26sz%3D12`;

  var rifles = {};

  var everything = {};

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
      //   everything[listOfData[key].magazines] = subCategories;
    });

    fs.writeFile(`${i}.json`, JSON.stringify(rifles, null, 2), (err) => {
      if (err) throw err;
      console.log("file succesfully saved!");
    });
  });
}
