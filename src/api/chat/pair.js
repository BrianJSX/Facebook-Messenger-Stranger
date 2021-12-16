const callSendAPI = require("../callApi");
const Room = require("../../app/Models/Room");
const User = require("../../app/Models/User");
const History = require("../../app/Models/History");

//handle event postback
const handleRoom = async (sender_psid, payload) => {
  try {
    let searchSex = "";

    if (payload === "male") {
      searchSex = "female";
    } else if (payload === "female") {
      searchSex = "male";
    } else if (payload === "lgbt") {
      searchSex = payload;
    }
    const userBlock = await User.findOne({ messenger_id: sender_psid });

    let roomIsEmpty = await Room.findOne({
      p1: { $nin: userBlock.block },
      gioitinh: String(searchSex),
      p2: null,
    }).sort({ updatedAt: 1 });

    if (roomIsEmpty != null) {
      //sender_psid is the p2. p2 not block user p1 but p1 block p2
      const userBlockOfP1 = await User.findOne({
        messenger_id: roomIsEmpty.p1,
      });
      let check = userBlockOfP1.block.indexOf(String(sender_psid));

      if (check >= 0) {
        await handleAddRoom(sender_psid, payload);
      } else {
        await handleUpdateP2(roomIsEmpty, sender_psid, payload);
        let idRoom = await handleAddHistory(roomIsEmpty, sender_psid, payload);
        await sendMessageAttachment(roomIsEmpty, sender_psid, idRoom);
      }
    } else {
      await handleAddRoom(sender_psid, payload);
    }
  } catch (error) {
    console.log("Lỗi handle room" + error);
  }
};

const handleAddHistory = async (roomIsEmpty, sender_psid, payload) => {
  const history = new History();
  history.p1 = roomIsEmpty.p1;
  history.p2 = sender_psid;
  await history.save();
  return history._id;
};

const sendMessageAttachment = async (roomIsEmpty, sender_psid, idRoom) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: `[BOT] ID: ${idRoom}. `,
            subtitle: `📌 Hãy nhớ ID phòng này để có thể tìm lại bạn ghép.`,
          },
        ],
      },
    },
  };
  await callSendAPI(roomIsEmpty.p1, response);
  await callSendAPI(sender_psid, response);
};

const handleAddRoom = async (sender_psid, payload) => {
  try {
    let userIsRoom = await User.findOne({
      messenger_id: sender_psid,
      state: 0,
    });
    if (userIsRoom != null) {
      let response2 = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: `[BOT] Đang tìm bạn để ghép.....💓. `,
                subtitle: `📌 Nếu thấy lâu gửi "end" hoặc ấn "Kết thúc" trên Menu Hệ Thống.`,
              },
            ],
          },
        },
      };

      const room = new Room();
      room.p1 = sender_psid;
      room.gioitinh = payload;
      await room.save();
      await User.updateOne({ messenger_id: sender_psid }, { state: 1 });

      await callSendAPI(sender_psid, response2);
    } else {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: `[BOT] Bạn đang trong phòng chat 💒. `,
                subtitle: `📌 Nếu thấy lâu gửi "end" hoặc ấn "Kết thúc" trên Menu Hệ Thống.`,
              },
            ],
          },
        },
      };
      await callSendAPI(sender_psid, response);
    }
  } catch (error) {
    console.log("Lỗi tạo phòng" + error);
  }
};

const handleUpdateP2 = async (roomIsEmpty, sender_psid, payload) => {
  try {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: `[BOT] 💓 Đã tìm thấy bạn rồi 💯 `,
              subtitle: `Hãy Gửi lời chào với nhau nào!! 🙋.`,
            },
          ],
        },
      },
    };

    await User.updateOne({ messenger_id: sender_psid }, { state: 1 });
    await Room.updateOne(
      { _id: roomIsEmpty._id },
      { p2: sender_psid },
      { gioitinh: payload }
    );
    await callSendAPI(roomIsEmpty.p1, response);
    await callSendAPI(sender_psid, response);
  } catch (error) {
    console.log("lỗi ghép cặp p2" + error);
  }
};

module.exports = {
  handleRoom: handleRoom,
};
