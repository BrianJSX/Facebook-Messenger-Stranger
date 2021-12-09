// const ApiHutech = require("./schedule");
const callSendAPI = require("../callApi");
const Hutech = require("hutech-api");
const Account = require("../../app/Models/Account");
const CryptoJS = require("crypto-js");
const SendTemplateCustom = require("../../helper/SendTemplateCustom");

const addAccount = async (sender_psid, username, password) => {
  let account = await Account.findOne({
    messenger_id: sender_psid,
  });
  let ciphertext = CryptoJS.AES.encrypt(
    password,
    process.env.SECRET_KEY
  ).toString();

  if (account == null) {
    let title = `[BOT] ☢️ Hệ thống đã lưu tài khoản`;
    let subtitle = `📌 Hãy ấn vào Menu chọn "Xem TKB" để có thời khóa biểu nhé`;

    const user = new Account();
    user.messenger_id = sender_psid;
    user.username = username;
    user.password = ciphertext;
    await user.save();
    await SendTemplateCustom(sender_psid, title, subtitle);
  } else {
    const user = await Account.updateOne(
      { messenger_id: sender_psid },
      { username: username, password: ciphertext }
    );
    let title = `[BOT] ☢️ Hệ thống đã update tài khoản mật khẩu của bạn`;
    let subtitle = `📌 Hãy ấn vào Menu chọn "Xem TKB" để có thời khóa biểu nhé`;
    await SendTemplateCustom(sender_psid, title, subtitle);
  }
};

const sendSchedule = async (sender_psid, username, password) => {
  let scheduleArr = [];
  let schedule = await Hutech.getScheduleWeek(username, password);
  if (!schedule) {
    let response = {
      text: "[BOT] Tài khoản hoặc mật khẩu đăng nhập không chính xác",
    };
    callSendAPI(sender_psid, response);
  } else {
    schedule.data.map((data, index) => {
      let scheduleObj = {
        title: `${data.subject} - ${data.room}`,
        subtitle: `${data.codeSubject} - ${data.weekday} - ${data.date} - Tiết: ${data.start} - ${schedule.account} `,
        image_url:
          "https://clipart.world/wp-content/uploads/2020/08/may-calendar-for-2018-year-png.png",
      };
      scheduleArr.push(scheduleObj);
    });
    sendTemplate(sender_psid, scheduleArr);
  }
};

const sendTemplate = async (sender_psid, data) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: data,
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

module.exports = {
  addAccount: addAccount,
  sendSchedule: sendSchedule,
};
