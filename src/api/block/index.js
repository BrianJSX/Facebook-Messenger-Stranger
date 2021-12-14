const request = require("request");
const User = require("../../app/Models/User");
const callSendAPI = require("../callApi");

const blockUser = async (sender_psid, uid) => {
  const user = await User.findOne({ messenger_id: sender_psid });
  let check = user.block.indexOf(uid);

  if (check < 0) {
    const userBlock = await User.findOneAndUpdate(
      { messenger_id: sender_psid },
      { $push: { block: String(uid) } }
    );

    let text = [
      {
        title: "[BOT Block] đã block bạn đang ghép. Nhấn nút kết thúc để ngắt cuộc trò chuyện!!",
        subtitle: "Lưu ý: Bạn sẽ không tìm thấy bạn đấy sau khi ghép nữa !!",
      },
    ];
    await sendTemplate(sender_psid, text);
  } else {
    let text = [
      {
        title: "[BOT Block] User này bạn đã block rồi.",
        subtitle: "Lưu ý: Nếu muốn ngắt cuộc trò chuyện. Vui lòng nhấn nút kết thúc trên Menu!!",
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

const sendRepQuickBlock = (sender_psid, uid) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      text: "[BOT] Bạn có muốn chặn người dùng này không??",
      quick_replies: [
        {
          content_type: "text",
          title: "Có",
          payload: `block ${uid}`,
        },
        {
          content_type: "text",
          title: "Không",
          payload: "NoBlock",
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
        console.error("Gửi hình lỗi:" + err);
      }
    }
  );
};

module.exports = { blockUser, sendRepQuickBlock };
