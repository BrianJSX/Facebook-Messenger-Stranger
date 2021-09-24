const axios = require("axios");

const sendMenuPre = async (param) => {
  let res = await axios
    .post(
      `https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      param
    )
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log(res);
};

module.exports = sendMenuPre;
