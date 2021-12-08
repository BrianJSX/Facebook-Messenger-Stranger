const callSendAPI = require("../callApi");
const sendMenuPre = require("./sendMenuPre");

const handleMenuPre = async () => {
  let response = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "postback",
            title: "💯 Tìm Nam 👦",
            payload: "male",
          },
          {
            type: "postback",
            title: "💯 Tìm Nữ 👧",
            payload: "female",
          },
          {
            type: "postback",
            title: "💯 Tìm chí cốt 🍻",
            payload: "lgbt",
          },
          {
            type: "postback",
            title: "️🔥 Thông tin bạn ghép",
            payload: "photo",
          },
          {
            type: "postback",
            title: "️🔥 Xem TKB",
            payload: "tkb",
          },
          {
            type: "postback",
            title: "❌ kết thúc ",
            payload: "end",
          },
          {
            type: "postback",
            title: "️🎶 Nghe nhạc",
            payload: "music",
          },
          {
            type: "postback",
            title: "️🎥 Xem tiktok",
            payload: "tiktok",
          },
          {
            type: "postback",
            title: "🌐 Dịch Song Ngữ (A-V)",
            payload: "dichav",
          },
          {
            type: "postback",
            title: "🚑 Xem Covid",
            payload: "covid",
          },
          {
            type: "postback",
            title: "🐶 Xem ảnh Cún Con",
            payload: "dog",
          },
          {
            type: "postback",
            title: "😽 Xem ảnh Mèo Con",
            payload: "cat",
          },
          {
            type: "postback",
            title: "👑 Xem UID của bạn",
            payload: "uid",
          },
          {
            type: "web_url",
            title: "Vẽ Tranh tặng bạn",
            url: "https://brianjsx.github.io/Paint-Image/",
            webview_height_ratio: "full",
          },
        ],
      },
    ],
  };
  await sendMenuPre(response);
};

module.exports = {
  handleMenuPre: handleMenuPre,
};
