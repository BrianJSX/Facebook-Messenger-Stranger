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
    text: `[BOT dịch] 🔰 Lưu ý bot chỉ hổ trợ dịch từ ngắn. 📍 "en" : dịch qua tiếng "ANH", "vi": dịch từ tiếng "VIỆT"`,
  };
  let response2 = {
    text: `[BOT dịch] 🔰 cú pháp: ( en | vi ) + từ muốn dịch. 📍 ví dụ: "en xin chào" hoặc "vi hello".`,
  };
  await callSendAPI(sender_psid, response1);
  await callSendAPI(sender_psid, response2);
};

module.exports = {
  translateEnglish: translateEnglish,
  translateVN: translateVN,
  replyTranslate: replyTranslate,
};
