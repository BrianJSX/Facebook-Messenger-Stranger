const request = require("request");

function sendFile(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: response,
          is_reusable: true,
        },
      },
    },
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
        console.log("Đã gửi audio");
      } else {
        console.error("Gửi hình lỗi:" + err);
      }
    }
  );
}
module.exports = sendFile;
