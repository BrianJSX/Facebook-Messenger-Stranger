const callSendAPI = require("../callApi");
const handleImage = require("../chat/handleImage");
const SendTemplateCustom = require("../../helper/SendTemplateCustom");
const findIndex = require("lodash/findIndex");

let idRequest = [];

const sendUserPairNull = async (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: `[BOT] 🔎 Đang tìm bạn Chat... `,
            subtitle: `📌 Nếu thấy lâu gửi "end" hoặc ấn "Kết thúc" trên Menu Hệ Thống..`,
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

const sendUserRoomEmpty = async (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: `[BOT] Vui lòng ghép cặp trước khi chọn tính năng này`,
            subtitle: `📌 Hãy tìm bạn ghép trong Menu của hệ thống !!`,
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

const sendUserPhotoPair = async (sender_psid, data) => {
  const index = checkIdRequest(sender_psid);
  if (index < 0) {
    await sendPhotoTimeout(sender_psid, data);
  } else {
    const index = checkIdRequest(sender_psid);
    let title = `[BOT] ☢️ Cảnh báo !!`;
    let subtitle = `📌 Lưu ý: Thực hiện lại yêu cầu này. Thời gian đợi sẽ lâu hơn các yêu cầu trước đó sẽ bị hủy.`;
    await SendTemplateCustom(sender_psid, title, subtitle);
    clearTimeout(idRequest[index].timer);
    idRequest.splice(index, 1);
    await sendPhotoTimeout(sender_psid, data);
  }
};

const checkIdRequest = (sender_psid) => {
  let check = findIndex(idRequest, function (o) {
    return o.id == sender_psid;
  });
  return check;
};

const sendPhotoTimeout = async (sender_psid, data) => {
  let title = `[BOT] Bạn đã yêu cầu xem thông tin bạn đang ghép`;
  let subtitle = `📌 BOT sẽ tự động gửi sau 3 phút. Thời gian chờ sẽ tăng nếu thực hiện lại yêu cầu này`;
  await SendTemplateCustom(sender_psid, title, subtitle);
  timer = setTimeout(async () => {
    let title = `ID: ${data.id}`;
    let gender = data.gender == "male" ? "Nam" : "Nữ";
    let locale = data.locale == "vi_VN" ? "Việt Nam" : data.locale;
    let subtitle = `📌 Tên: ${data.first_name} ${data.last_name} 🌀 Giới Tính: ${gender} 🌎 Quốc gia: ${locale}`;
    await handleImage(sender_psid, data.profile_pic);
    await SendTemplateCustom(sender_psid, title, subtitle);
  }, 15000);
  let obj = {
    id: sender_psid,
    timer: timer,
  };
  idRequest.push(obj);
};

module.exports = {
  sendUserPairNull: sendUserPairNull,
  sendUserRoomEmpty: sendUserRoomEmpty,
  sendUserPhotoPair: sendUserPhotoPair,
};
