const request = require("request");
const callSendAPI = require("./callApi");

function sendVideo(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          is_reusable: true,
          url: response
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
        if (res.body.error) {
          let response = {
            text: `[BOT TIKTOK] 🎵 ${res.body.error.message} Vui lòng thử lại.`,
          };
          callSendAPI(sender_psid, response);
        } else {
          console.log("Đã gửi video success");
        }
      } else {
        console.error("Gửi hình lỗi:" + err);
      }
    }
  );
}
module.exports = sendVideo;
