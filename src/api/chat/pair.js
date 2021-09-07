const callSendAPI = require("../callApi");
const Room = require("../../app/Models/Room");
const User = require("../../app/Models/User");

//handle event postback
const handleRoom = async (sender_psid) => {
  let roomIsEmpty = await Room.findOne({ p1: { $nin: sender_psid }, p2: null });

  if (roomIsEmpty != null) {
    handleUpdateP2(roomIsEmpty, sender_psid);
  } else {
    handleAddRoom(sender_psid);
  }

};

const handleAddRoom = async (sender_psid) => {
  let userIsRoom = await User.findOne({ messenger_id: sender_psid, state: 0 });

  if(userIsRoom != null){
    let response = {
        text: `Đã tạo phòng chat 💒 ID: ${userIsRoom._id}. Gửi "end" để kết thúc phòng chat ❌. [BOT] Đang tìm bạn chat để ghép... 💏 `,
    };
    const room = new Room();
    room.p1 = sender_psid;
    await room.save();
    await callSendAPI(sender_psid, response);
    await User.updateOne({ messenger_id: sender_psid }, { state: 1 });
  } else { 
    let response = {
        text: `[BOT] Bạn đang trong phòng chat 💒. Gửi "end" để kết thúc phòng chat ❌.`,
    };
    await callSendAPI(sender_psid, response);
  }

};

const handleUpdateP2 = async (roomIsEmpty, sender_psid) => {
  let response = {
    text: `[BOT] 💓 Ping Ping! Đã tìm thấy bạn rồi 💯!! Gửi lời chào với nhau nào!! 🙋`,
  };
  let responseHello = {
    text: `Chào bạn !!`,
  };
  let roomUpdate = await Room.updateOne(
    { _id: roomIsEmpty._id },
    { p2: sender_psid }
  );
  const userP2 = sender_psid;
  const userP1 = roomIsEmpty.p1;

  await User.updateOne({ messenger_id: sender_psid }, { state: 1 });
  await callSendAPI(userP1, response);
  await callSendAPI(userP1, responseHello);
  await callSendAPI(userP2, response);
  await callSendAPI(userP2, responseHello);
};

module.exports = {
  handleRoom: handleRoom,
};
