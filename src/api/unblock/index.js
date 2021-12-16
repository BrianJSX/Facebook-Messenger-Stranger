const request = require("request");
const User = require("../../app/Models/User");
const callSendAPI = require("../callApi");

const unBlockUser = async (sender_psid) => {
  const user = await User.findOne({ messenger_id: sender_psid });
  const userArray = user.block;

  if (userArray.length > 0) {
    let data = [];

    userArray.map((item) => {
      let dataObj = {
        content_type: "text",
        title: `${item}`,
        payload: `bochan ${item}`,
      };
      data.push(dataObj);
    });
    await sendRepQuickBlock(sender_psid, data);
  } else {
    let text = [
      {
        title: "[BOT Block] Danh sách chặn của bạn trống !!",
        subtitle:
          "Chú ý: Nếu muốn chặn người dùng. Vui lòng chọn chức năng chặn trên Menu hệ thống!!",
      },
    ];
    await sendTemplate(sender_psid, text);
  }
};

const handleUnBlock = async (sender_psid, uid) => {
  const user = await User.findOne({ messenger_id: sender_psid });
  const check = user.block.indexOf(uid);

  if (check < 0) {
    console.log("user không có trong danh sách chặn");
  } else {
    const userBlock = await User.findOneAndUpdate(
      { messenger_id: sender_psid },
      { $pull: { block: String(uid) } }
    );

    let text = [
      {
        title: `[BOT Block] Đã bỏ chặn ID: ${uid}`,
        subtitle:
          "Chú ý: Nếu muốn chặn người dùng. Vui lòng chọn chức năng chặn trên Menu hệ thống!!",
      },
    ];
    await sendTemplate(sender_psid, text);
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

const sendRepQuickBlock = (sender_psid, userArray) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      text: "[BOT] Vui lòng chọn user bạn muốn bỏ chặn??",
      quick_replies: userArray,
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
        console.error("Gửi hình lỗi:" + err);
      }
    }
  );
};

module.exports = { unBlockUser, handleUnBlock };
