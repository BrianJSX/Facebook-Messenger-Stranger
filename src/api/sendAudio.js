const request = require("request");

// Sends response messages via the Send API
// function sendAudio(sender_psid, urlMp3) {
//   //response when user send the message
//   let fb_url = "https://graph.facebook.com/v2.6/me/messages";
//   let data = {
//     recipient: sender_psid,
//     message: { attachment: { type: "audio", payload: {} } },
//   };

//   let files = {
//     filedata: (urlMp3, "audio/mp3"),
//   };

//   let params = { access_token: process.env.PAGE_ACCESS_TOKEN };
//   let resp = request.post(
//     fb_url,
//     (params = params),
//     (data = data),
//     (files = files)
//   );
// }
function sendAudio(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      attachment: {
        type: "audio",
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
module.exports = sendAudio;
