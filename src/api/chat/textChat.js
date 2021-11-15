const User = require("../../app/Models/User");
const Room = require("../../app/Models/Room");
const callSendAPI = require("../callApi");
const handleImage = require("./handleImage");
const { handleCovid } = require("../covid19");
const { handleMenu } = require("./handleEndAction");
const { searchMusic } = require("../musicPlayer");
const { translateEnglish, translateVN } = require("../translate");
const SendMessage = require("../../helper/SendMessage");

const handleUser = async (sender_psid, received_message) => {
  try {
    if (
      received_message.text != null &&
      (received_message.text.includes("kcovid") ||
        received_message.text.includes("Kcovid"))
    ) {
      await handleCovid(sender_psid, received_message);
    } else if (
      received_message.text != null &&
      (received_message.text.includes("music") ||
        received_message.text.includes("Music"))
    ) {
      await searchMusic(sender_psid, received_message);
    } else if (
      received_message.text != null &&
      (received_message.text.includes("vi") ||
        received_message.text.includes("VI") ||
        received_message.text.includes("Vi"))
    ) {
      const text = received_message.text.slice(3);
      await translateEnglish(sender_psid, text);
    } else if (
      received_message.text != null &&
      (received_message.text.includes("en") ||
        received_message.text.includes("EN") ||
        received_message.text.includes("En"))
    ) {
      const text = received_message.text.slice(3);
      await translateVN(sender_psid, text);
    } else {
      let userNotRoom = await User.find({
        messenger_id: sender_psid,
        state: 0,
      });

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
          } else {
            if (userConnect.p1 == sender_psid) {
              SendMessage(received_message, userConnect.p2)
            } else {
              SendMessage(received_message, userConnect.p1)
            }
          }
        } else {
          await handleAddUser(sender_psid);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleAddUser = async (sender_psid) => {
  try {
    const user = new User();
    user.messenger_id = sender_psid;
    await user.save();
    await handleMenu(sender_psid);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleUser: handleUser,
};
