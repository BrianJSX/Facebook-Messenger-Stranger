const callSendAPI = require("../../api/callApi");

const SendMessageP1 = async (p1, p2) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: `[BOT] Bạn bên kia đang gửi cho bạn một thứ gì đó. 💑 `,
            subtitle: `📌 Tệp đang được gửi. Vui lòng chờ một chút...`,
          },
        ],
      },
    },
  };

  let response1 = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: `[BOT] Tệp của bạn đã được gửi. 💑 `,
            subtitle: `📌 Hãy xem hoặc nghe cùng bạn đó nhé...💑`,
          },
        ],
      },
    },
  };
  await callSendAPI(p1, response1);
  await callSendAPI(p2, response);
};

module.exports = SendMessageP1