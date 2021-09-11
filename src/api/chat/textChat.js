const User = require("../../app/Models/User");
const Room = require("../../app/Models/Room");
const callSendAPI = require("../callApi");
const callSendImgAPI = require("../callSendImgAPI");

const handleUser = async (sender_psid, received_message) => {
  try {
    let userNotRoom = await User.find({ messenger_id: sender_psid, state: 0 });

    if (userNotRoom.length > 0) {
      await handleMenu(sender_psid);
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
            text: '[BOT] 🔎 Đang tìm bạn Chat..., gửi "end" sau đó Chọn Giới tính mới ❌.',
          };
          await callSendAPI(sender_psid, response);
        } else {
          if (userConnect.p1 == sender_psid) {
            if (received_message.text == null) {
              let urlImage = received_message.attachments[0].payload.url;
              await callSendImgAPI(userConnect.p2, urlImage);
            } else {
              let response = {
                text: `${received_message.text}`,
              };
              await callSendAPI(userConnect.p2, response);
            }
          } else {
            if (received_message.text == null) {
              let urlImage = received_message.attachments[0].payload.url;
              await callSendImgAPI(userConnect.p1, urlImage);
            } else {
              let response = {
                text: `${received_message.text}`,
              };
              await callSendAPI(userConnect.p1, response);
            }
          }
        }
      } else {
        await handleAddUser(sender_psid);
      }
    }
  } catch (error) {
    console.log("Lỗi khi trong hàm handleUser" + error);
  }
};

const handleEndAction = async (sender_psid, received_message) => {
  try {
    let getRoom = await Room.findOne({
      $or: [{ p1: sender_psid }, { p2: sender_psid }],
    });

    if (getRoom == null) {
      let response = {
        text: `[BOT] Hiện tại bạn chưa có phòng để kết thúc 👑. Vui lòng chọn giới tính đề chat 💓`,
      };
      await callSendAPI(sender_psid, response);
    } else {
      const roomId = getRoom._id;
      const userP1 = getRoom.p1;
      const userP2 = getRoom.p2;

      if (userP1 == sender_psid) {
        let response = {
          text: "[BOT] 💔 Hic! Chủ phòng đã ngắt kết nối rồi. Vui lòng chọn giới tính bạn muốn tìm 💑",
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
          text: `[BOT] 💔 Hic! Bạn ý đã ngắt kết nối rồi .🔎 Đang tìm kiếm người bạn khác... 💑,  Gửi "end" để kết thúc phòng ❌.  `,
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

const handleAddUser = async (sender_psid) => {
  try {
    const user = new User();
    user.messenger_id = sender_psid;
    await user.save();
    await handleMenu(sender_psid);
  } catch (error) {
    console.log("Lỗi khi add user" + error);
  }
};

const handleMenu = async (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "[BOT] 💟💟💟 Chào mừng bạn đến với Dầu Tiếng Connection 📸. Trước khi bắt đầu 🤔, hãy chắc chắn rằng bạn đã chọn đúng giới tính người muốn chat cùng. 👪",
        buttons: [
          {
            type: "postback",
            title: "💯 Tìm bạn là Nam. 👦",
            payload: "male",
          },
          {
            type: "postback",
            title: "💯 Tìm bạn là Nữ. 👧",
            payload: "female",
          },
          {
            type: "postback",
            title: "💯 Tìm bạn cùng giới. 🍻",
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
