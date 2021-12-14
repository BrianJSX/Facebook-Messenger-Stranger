// const ApiHutech = require("./schedule");
const callSendAPI = require("../callApi");
const Hutech = require("hutech-api");
const Account = require("../../app/Models/Account");
const CryptoJS = require("crypto-js");
const SendTemplateCustom = require("../../helper/SendTemplateCustom");
const request = require("request");

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
    setTimeout(async () => {
      await sendRepQuickSchedule(sender_psid);
    }, 2000);
  } else {
    const user = await Account.updateOne(
      { messenger_id: sender_psid },
      { username: username, password: ciphertext }
    );
    let title = `[BOT] ☢️ Hệ thống đã update tài khoản mật khẩu của bạn`;
    let subtitle = `📌 Hãy ấn vào Menu chọn "Xem TKB" để có thời khóa biểu nhé`;
    await SendTemplateCustom(sender_psid, title, subtitle);
    setTimeout(async () => {
      await sendRepQuickSchedule(sender_psid);
    }, 2000);
  }
};

const sendSchedule = async (sender_psid, username, password) => {
  let scheduleArr = [];
  let schedule = await Hutech.getScheduleWeek(username, password);
  if (!schedule) {
    let title = `[BOT] ☢️ Tài khoản hoặc mật khẩu không chính xác. Vui lòng cập nhật !!`;
    let subtitle = `📌 Update Cú pháp: login <MSSV> <Mật Khẩu>. VD: login 1811060485 123456`;
    await SendTemplateCustom(sender_psid, title, subtitle);
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

const sendSchedulePersonal = async (sender_psid, username, password) => {
  let scheduleArr = [];
  let schedule = await Hutech.getSchedulePersonal(username, password);
  if (!schedule) {
    let response = {
      text: "[BOT] Tài khoản hoặc mật khẩu đăng nhập không chính xác hoặc web trường bị quá tải",
    };
    callSendAPI(sender_psid, response);
  } else {
    schedule.data.map((data, index) => {
      let scheduleObj = {
        title: `${data.subject} - ${data.room}`,
        subtitle: `${data.codeSubject} - ${data.date} - Tiết: ${data.start}`,
        image_url:
          "https://clipart.world/wp-content/uploads/2020/08/may-calendar-for-2018-year-png.png",
      };
      scheduleArr.push(scheduleObj);
    });
    sendTemplate(sender_psid, scheduleArr);
  }
};

const sendInfoStudent = async (sender_psid, username, password) => {
  let info = [];
  let student = await Hutech.getInfoStudent(username, password);
  if (!student) {
    let response = {
      text: "[BOT] Tài khoản hoặc mật khẩu đăng nhập không chính xác hoặc web trường bị quá tải",
    };
    callSendAPI(sender_psid, response);
  } else {
    let scheduleObj = {
      title: `${student.studentCode} - ${student.studentName} - ${student.country} - Giới tính: ${student.gender}`,
      subtitle: `${student.class} - ${student.department} - ${student.education} -  ${student.year}`,
      image_url:
        "https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png",
    };
    info.push(scheduleObj);
    sendTemplate(sender_psid, info);
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

function sendRepQuickSchedule(sender_psid) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      text: "[BOT] 📬 Vui lòng chọn loại TKB bạn muốn xem??",
      quick_replies: [
        {
          content_type: "text",
          title: "Tuần",
          payload: `week`,
        },
        {
          content_type: "text",
          title: "Cá nhân",
          payload: "personal",
        },
        {
          content_type: "text",
          title: "Thông tin sinh viên",
          payload: "infoStudent",
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
        console.error(err);
      }
    }
  );
}

module.exports = {
  addAccount,
  sendSchedule,
  sendSchedulePersonal,
  sendRepQuickSchedule,
  sendInfoStudent, 
};
