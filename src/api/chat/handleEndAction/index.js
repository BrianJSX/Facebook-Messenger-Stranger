const User = require("../../../app/Models/User");
const Room = require("../../../app/Models/Room");
const callSendAPI = require("../../callApi");

const handleEndAction = async (sender_psid, received_message) => {
  try {
    let getRoom = await Room.findOne({
      $or: [{ p1: sender_psid }, { p2: sender_psid }],
    });

    if (getRoom == null) {
      let response = {
        text: `[BOT] Hiện tại bạn chưa có phòng để kết thúc 👑. Vui lòng chọn giới tính trong Menu hệ thống 💓`,
      };
      await callSendAPI(sender_psid, response);
    } else {
      const roomId = getRoom._id;
      const userP1 = getRoom.p1;
      const userP2 = getRoom.p2;

      if (userP1 == sender_psid) {
        let response = {
          text: "[BOT] ❌ Chủ phòng đã ngắt kết nối. Vui Lòng chọn giới tính mới. 💓",
        };
        await User.updateMany(
          { $or: [{ messenger_id: userP1 }, { messenger_id: userP2 }] },
          { state: 0 }
        );
        await Room.deleteOne({ _id: roomId });

        await callSendAPI(userP1, response);
        await callSendAPI(userP2, response);
        await handleMenu(userP1);
        await handleMenu(userP2);
      } else {
        let responseP1 = {
          text: `[BOT] 💔 Hic! Bạn ý đã ngắt kết nối rồi .🔎 Đang tìm kiếm người bạn khác... 💑`,
        };
        let responseP2 = {
          text: `[BOT] 💔 đã kết thúc cuộc trò chuyện ❌. Vui lòng chọn bạn chat có giới tính mới 💑`,
        };
        await User.updateOne({ messenger_id: userP2 }, { state: 0 });
        await Room.updateOne({ _id: roomId }, { p2: null });
        await callSendAPI(userP1, responseP1);
        await callSendAPI(userP2, responseP2);
        await handleMenu(userP2);
      }
    }
  } catch (error) {
    console.log("lỗi khi kết thúc phòng" + error);
  }
};

const handleMenu = async (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "[BOT] Chào mừng bạn đến với Hutech Together 📸. Trước khi bắt đầu 🤔, hãy chắc chắn rằng bạn đã chọn đúng giới tính muốn chat cùng. 👪",
        buttons: [
          {
            type: "postback",
            title: "Tìm Nam 👦",
            payload: "male",
          },
          {
            type: "postback",
            title: "Tìm Nữ 👧",
            payload: "female",
          },
          {
            type: "postback",
            title: "Tìm chí cốt 🍻",
            payload: "lgbt",
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

module.exports = {
  handleMenu: handleMenu,
  handleEndAction: handleEndAction,
};
