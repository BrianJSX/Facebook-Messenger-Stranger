const ApiHutech = require("./schedule");
const filter = require("lodash/filter");
const callSendAPI = require("../callApi");

const sendSchedule = async (sender_psid, username, password) => {
  const API = new ApiHutech();
  const info = {
    user: username,
    pass: password,
  };
  let scheduleArr = [];
  await API.login(info);
  let schedule = await API.getSchedule();
  schedule[0].data.map((data, index) => {
    let scheduleObj = {
      title: `${data.subject} - ${data.room}`,
      subtitle: `${data.codeSubject} - ${data.weekday} - ${data.date} - Tiết: ${data.start} - ${schedule[0].account} `,
      image_url:
        "https://clipart.world/wp-content/uploads/2020/08/may-calendar-for-2018-year-png.png",
    };
    scheduleArr.push(scheduleObj);
  });
  sendTemplate(sender_psid, scheduleArr);
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
  sendSchedule: sendSchedule,
};
