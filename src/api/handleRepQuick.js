const shareMusic = require("../api/shareMusic");
const shareDogCat = require("../api/shareDogCat");
const shareTiktok = require("../api/shareTiktok");
const { handleEndAction } = require("./chat/handleEndAction");
const SendTemplateCustom = require("../helper/SendTemplateCustom");
const { sendSchedule, sendSchedulePersonal, sendInfoStudent } = require("./scheduleHutech");
const AccountModel = require("../app/Models/Account");
const CryptoJS = require("crypto-js");

async function handleRepQuick(sender_psid, message) {
  let payload = message.quick_reply.payload;

  //check account reply quick is week or personal
  let account = await AccountModel.findOne({
    messenger_id: sender_psid,
  });

  if (payload.includes("shareMusic")) {
    let urlMusic = payload.slice(11);
    shareMusic(sender_psid, urlMusic);
  } else if (payload.includes("shareDogCat")) {
    let urlImage = payload.slice(12);
    shareDogCat(sender_psid, urlImage);
  } else if (payload.includes("shareTiktok")) {
    let urlVideo = payload.slice(12);
    shareTiktok(sender_psid, urlVideo);
  } else if (payload.includes("yesEnd")) {
    await handleEndAction(sender_psid, payload);
  } else if (payload.includes("week")) {
    if (account != null) {
      var bytes = CryptoJS.AES.decrypt(
        account.password,
        process.env.SECRET_KEY
      );
      var originalText = bytes.toString(CryptoJS.enc.Utf8);

      let username = account.username;
      let password = originalText;
      await sendSchedule(sender_psid, username, password);
    } else {
      let title = `[BOT] ☢️ Vui lòng nhập tài khoản và mật khẩu trước để lấy thời khóa biểu.`;
      let subtitle = `📌 Cú pháp: login <MSSV> <Mật khẩu>. Ví dụ: login 1811060485 12345`;
      await SendTemplateCustom(sender_psid, title, subtitle);
    }
  } else if (payload.includes("personal")) {
    if (account != null) {
      var bytes = CryptoJS.AES.decrypt(
        account.password,
        process.env.SECRET_KEY
      );
      var originalText = bytes.toString(CryptoJS.enc.Utf8);

      let username = account.username;
      let password = originalText;
      await sendSchedulePersonal(sender_psid, username, password);
    } else {
      let title = `[BOT] ☢️ Vui lòng nhập tài khoản và mật khẩu trước để lấy thời khóa biểu.`;
      let subtitle = `📌 Cú pháp: login <MSSV> <Mật khẩu>. Ví dụ: login 1811060485 12345`;
      await SendTemplateCustom(sender_psid, title, subtitle);
    }
  } else if (payload.includes("infoStudent")) {
    if (account != null) {
      var bytes = CryptoJS.AES.decrypt(
        account.password,
        process.env.SECRET_KEY
      );
      var originalText = bytes.toString(CryptoJS.enc.Utf8);

      let username = account.username;
      let password = originalText;
      await sendInfoStudent(sender_psid, username, password);
    } else {
      let title = `[BOT] ☢️ Vui lòng nhập tài khoản và mật khẩu trước để lấy thời khóa biểu.`;
      let subtitle = `📌 Cú pháp: login <MSSV> <Mật khẩu>. Ví dụ: login 1811060485 12345`;
      await SendTemplateCustom(sender_psid, title, subtitle);
    }
  }
}

module.exports = handleRepQuick;
