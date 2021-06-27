const User = require("../../app/Models/User");
const Room = require("../../app/Models/Room");
const callSendAPI = require("../callApi");

const handleUser = async (sender_psid, received_message) => {
  let userNotRoom = await User.find({ messenger_id: sender_psid, state: 0 });

  if (userNotRoom.length > 0) {
    handleMenu(sender_psid);
  } else {
    let userIsRoom = await User.findOne({
      messenger_id: sender_psid,
      state: 1,
    });

    if (userIsRoom != null) {
      let userConnect = await Room.findOne({
        $or: [{ p1: sender_psid }, { p2: sender_psid }],
      });
      //check room.p2 == null send message
      if (userConnect.p2 == null) {
        response = {
          text: '[BOT] 🔎 Đang tìm bạn Chat..., gửi "end" sau đó Chọn Giới tính mới.',
        };
        callSendAPI(sender_psid, response);
      } else {
        //check user is sender_psid send message to userP2
        if (userConnect.p1 == sender_psid) {
          response = {
            text: `${received_message.text}`,
          };
          callSendAPI(userConnect.p2, response);
        } else {
          response = {
            text: `${received_message.text}`,
          };
          callSendAPI(userConnect.p1, response);
        }
      }
    } else {
      handleAddUser(sender_psid);
    }
  }
};

const handleEndAction = async (sender_psid, received_message) => {
  let getRoom = await Room.findOne({
    $or: [{ p1: sender_psid }, { p2: sender_psid }],
  });
  const roomId = getRoom._id;
  const userP1 = getRoom.p1;
  const userP2 = getRoom.p2;

  if (userP1 == sender_psid) {
    response = {
      text: "[BOT] Phòng chat đã bị chủ phòng kết thúc. Vui lòng chọn giới tính bạn muốn tìm",
    };
    await Room.deleteOne({ _id: roomId });
    await User.updateMany(
      { $or: [{ messenger_id: userP1 }, { messenger_id: userP2 }] },
      { state: 0 }
    );
    await callSendAPI(userP1, response);
    await callSendAPI(userP2, response);
    handleMenu(userP1);
    handleMenu(userP2);
  } else {
    responseP1 = {
      text: `[BOT] Bạn kia đã kết thúc cuộc trò truyện. Đang tìm kiếm người bạn khác. Gửi "end" để kết thúc hành động`,
    };
    responseP2 = {
      text: `[BOT] đã kết thúc cuộc trò truyện`,
    };
    await Room.updateOne({ _id: roomId }, { p2: null });
    await User.updateOne({ messenger_id: userP2 }, { state: 0 });
    await callSendAPI(userP1, responseP1);
    await callSendAPI(userP2, responseP2);
    handleMenu(userP2);
  }
};

const handleAddUser = async (sender_psid) => {
  const user = new User();
  user.messenger_id = sender_psid;
  await user.save();
  handleMenu(sender_psid);
};

const handleMenu = async (sender_psid) => {
  let response;
  response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "[BOT] Chào mừng bạn đến với Dầu Tiếng Connection. Trước khi bắt đầu, hãy chắc chắn rằng bạn đã chọn đúng giới tính người muốn chat cùng.",
        buttons: [
          {
            type: "postback",
            title: "Tìm Nam",
            payload: "male",
          },
          {
            type: "postback",
            title: "Tìm Nữ",
            payload: "female",
          },
          {
            type: "postback",
            title: "Tìm ACE chí cốt",
            payload: "lgbt",
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

module.exports = {
  handleUser: handleUser,
  handleMenu: handleMenu,
  handleEndAction: handleEndAction,
};
