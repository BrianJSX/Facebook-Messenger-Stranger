const requestApiGet = require("../requestApi");
const _ = require("lodash");
const callSendAPI = require("../callApi");

const handleCovid = async (sender_psid, received_message) => {
  try {
    let strName = _.capitalize(received_message.text.slice(7));
    let uptoLowerStr = strName.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
      match.toUpperCase()
    );
    let city = "";
    if (uptoLowerStr.includes("Hồ Chí Minh")) {
      let text = "TP.";
      city = text.concat(" ", uptoLowerStr);
    } else {
      city = uptoLowerStr;
    }
    let data = await requestApiGet(
      "https://static.pipezero.com/covid/data.json"
    );
    let dataCity = _.find(data.locations, { name: city });
    if (dataCity == null) {
      let response = {
        text: `[BOT COVID] Không tìm thấy Tỉnh được yêu cầu ❌. 📌Vui lòng ghi đúng tên và có dấu ( chỉ ghi tên TP/Tỉnh không thêm các kí tự đặc biệt ) `,
      };
      await callSendAPI(sender_psid, response);
    } else {
      let response = {
        text: `[BOT COVID] 🌎 Khu Vực ${dataCity.name}. 🛑 Tổng ca nhiễm: ${dataCity.cases}. 💢 Hôm nay: ${dataCity.casesToday}. ☠️ Số người chết: ${dataCity.death}`,
      };
      await callSendAPI(sender_psid, response);
    }
  } catch (error) {
    console.log(error);
    let message = {
      text: `[BOT Lỗi] Lỗi Hệ Thống Vui Lòng Thử lại.`,
    };
    await callSendAPI(sender_psid, message);
  }
};

module.exports = {
  handleCovid: handleCovid,
};
