const request = require("request");

function sendRepQuick(sender_psid, key, url, textBot, title1, title2) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      text: textBot ? textBot : "[BOT] 📬 Bạn có muốn gửi cho bạn đang ghép không (5s) 😍??",
      quick_replies: [
        {
          content_type: "text",
          title: title1 ? title1 : "Có",
          payload: title1 ? title1 : `${key} ${url}`,
        },
        {
          content_type: "text",
          title: title2 ? title2 : "Không",
          payload: title2 ? title2 : "noShareMusic",
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
      } else {
        console.error("Gửi hình lỗi:" + err);
      }
    }
  );
}
module.exports = sendRepQuick;
