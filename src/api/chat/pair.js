const callSendAPI = require("../callApi");
const Room = require("../../app/Models/Room");
const User = require("../../app/Models/User");

//handle event postback
const handleRoom = async (sender_psid, payload) => {
  try {
    let searchSex = "";
    if (payload === "male") {
      searchSex = "female";
    } else if (payload === "female") {
      searchSex = "male";
    } else if (payload === "lgbt") {
      searchSex = "lgbt";
    }

    let roomIsEmpty = await Room.findOne({
      p1: { $nin: sender_psid },
      gioitinh: String(searchSex),
      p2: null,
    }).sort({ updatedAt: 1 });

    if (roomIsEmpty != null) {
      await handleUpdateP2(roomIsEmpty, sender_psid, payload);
    } else {
      await handleAddRoom(sender_psid, payload);
    }
  } catch (error) {
    console.log("Lỗi handle room" + error);
  }
};

const handleAddRoom = async (sender_psid, payload) => {
  try {
    let userIsRoom = await User.findOne({
      messenger_id: sender_psid,
      state: 0,
    });
    if (userIsRoom != null) {
      let response1 = {
        text: `Đã tạo phòng chat 💒 ID: ${userIsRoom._id}. Bạn đã trở thành chủ phòng chat 🎩`,
      };
      let response2 = {
        text: `[BOT] Đang tìm bạn chat để ghép... 💏. Gửi "end" để kết thúc phòng chat ❌.  `,
      };

      const room = new Room();
      room.p1 = sender_psid;
      room.gioitinh = payload;
      await room.save();
      await User.updateOne({ messenger_id: sender_psid }, { state: 1 });

      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);
    } else {
      let response = {
        text: `[BOT] Bạn đang trong phòng chat 💒. Gửi "end" để kết thúc phòng chat ❌.`,
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
      text: `[BOT] 💓 Ping Ping! Đã tìm thấy bạn rồi 💯!! Gửi lời chào với nhau nào!! 🙋`,
    };
    let responseHello = {
      text: `Chào`,
    };

    await User.updateOne({ messenger_id: sender_psid }, { state: 1 });
    await Room.updateOne(
      { _id: roomIsEmpty._id },
      { p2: sender_psid },
      { gioitinh: payload }
    );
    await callSendAPI(roomIsEmpty.p1, response);
    await callSendAPI(sender_psid, response);
    await callSendAPI(roomIsEmpty.p1, responseHello);
    await callSendAPI(sender_psid, responseHello);
  } catch (error) {
    console.log("lỗi ghép cặp p2" + error);
  }
};

module.exports = {
  handleRoom: handleRoom,
};
