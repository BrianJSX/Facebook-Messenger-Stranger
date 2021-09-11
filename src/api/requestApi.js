const axios = require("axios");

async function requestApiGet(url) {
  let data = "";
  await axios
    .get(url)
    .then(function (response) {
      // handle success
      data = response.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
    return data;
}
module.exports = requestApiGet;
