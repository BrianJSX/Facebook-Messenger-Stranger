const request = require("request");

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
  //response when user send the message
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log(res.body);
        console.log("Đã gửi tin nhắn");
      } else {
        console.error("Gửi tin nhắn lỗi:" + err);
      }
    }
  );
}

module.exports = callSendAPI;
