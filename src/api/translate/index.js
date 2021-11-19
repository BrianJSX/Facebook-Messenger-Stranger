const translate = require("translate");
const callSendAPI = require("../callApi");

require("dotenv").config();

translate.engine = "google";
translate.key = process.env.GOOGLE_KEY;

const translateEnglish = async (sender_psid, message) => {
  const text = await translate(message, { to: "vi", from: "en" });
  let response = {
    text: `[BOT dịch] 🔰 ${text}`,
  };
  await callSendAPI(sender_psid, response);
};

const translateVN = async (sender_psid, message) => {
  const text = await translate(message, { to: "en", from: "vi" });
  let response = {
    text: `[BOT dịch] 🔰 ${text}`,
  };
  await callSendAPI(sender_psid, response);
};

const replyTranslate = async (sender_psid) => {
  let response1 = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "[BOT dịch] 🔰 Lưu ý bot không hổ trợ dịch đoạn văn dài.",
            subtitle: `📍 "en" -> dịch qua Tiếng Anh | "vi" -> dịch qua Tiếng Việt`,
          },
        ],
      },
    },
  };
  let response2 = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "[BOT dịch] 🔰 Bạn muốn dịch song ngữ Anh - Việt",
            subtitle: `📍 Cú pháp: ( en | vi ) + từ muốn dịch. VD: "en xin chào".`,
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response2);
  await callSendAPI(sender_psid, response1);
};

module.exports = {
  translateEnglish: translateEnglish,
  translateVN: translateVN,
  replyTranslate: replyTranslate,
};
