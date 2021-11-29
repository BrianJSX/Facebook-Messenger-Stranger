const request = require("request");

function sendRepQuick(sender_psid, key, url, textBot) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      text: textBot ? textBot : "[BOT] 📬 Bạn có muốn gửi cho bạn đang ghép không (5s) 😍??",
      quick_replies: [
        {
          content_type: "text",
          title: "Có",
          payload: `${key} ${url}`,
        },
        {
          content_type: "text",
          title: "Không",
          payload: "noShareMusic",
        },
      ],
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
module.exports = sendRepQuick;
