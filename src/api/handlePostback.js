const Room = require("../api/chat/pair");
const callSendAPI = require("./callApi");
const handleImage = require("./chat/handleImage");
const textChat = require("./chat/textChat");
const requestApiGet = require("./requestApi");
const { handleEndAction } = require("./chat/handleEndAction");
const Nhaccuatui = require("nhaccuatui-api");
const sendAudio = require("./sendAudio");
const { getMusic, replyMusic } = require("./musicPlayer");
const { sendTiktokTrend } = require("./tiktok");
const sendVideo = require("./sendVideo");
const sendRepQuick = require("./sendRepQuick");
const { replyTranslate } = require("./translate");
const UserModel = require("../app/Models/User");
const RoomModel = require("../app/Models/Room");
const ZingMp3 = require("zingmp3-api");

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  try {
    let payload = received_postback.payload;
    let userIsRoom = await UserModel.findOne({
      messenger_id: sender_psid,
      state: 1,
    });

    if (payload === "male") {
      //payload find male
      Room.handleRoom(sender_psid, payload);
    } else if (payload === "female") {
      //payload find female
      Room.handleRoom(sender_psid, payload);
    } else if (payload === "lgbt") {
      //payload find bro
      Room.handleRoom(sender_psid, payload);
    } else if (payload === "start") {
      //payload click button start
      await textChat.handleUser(sender_psid, payload);
    } else if (payload === "end") {
      //payload click button end
      await handleEndAction(sender_psid, payload);
    } else if (payload === "uid") {
      //payload find UID
      let response = {
        text: `[BOT] UID 👒 của bạn là:  ${sender_psid} 👑`,
      };
      await callSendAPI(sender_psid, response);
    } else if (payload === "dog") {
      //payload send image dog
      let data = await requestApiGet("https://dog.ceo/api/breeds/image/random");
      await handleImage(sender_psid, String(data.message));
      setTimeout(async () => {
        if (userIsRoom != null) {
          await sendRepQuick(sender_psid, "shareDogCat", String(data.message));
        }
      }, 7000);
    } else if (payload === "cat") {
      //payload send image cat
      let data = await requestApiGet(
        "https://api.thecatapi.com/v1/images/search"
      );
      await handleImage(sender_psid, String(data[0].url));

      setTimeout(async () => {
        if (userIsRoom != null) {
          await sendRepQuick(sender_psid, "shareDogCat", String(data[0].url));
        }
      }, 7000);
    } else if (payload == "covid") {
      //payload send data covid
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title:
                  "[BOT Covid] 📍 Bạn muốn tra dữ liệu Covid-19 ở 63 tỉnh thành trên cả nước",
                subtitle: `Cú pháp: "kcovid" + tên "TP hoặc Tỉnh". ️🎯 VD: kcovid Bình Dương`,
              },
            ],
          },
        },
      };
      await callSendAPI(sender_psid, response);
    } else if (payload == "music") {
      //payload send top trending music
      await replyMusic(sender_psid);
      await getMusic(sender_psid, received_postback);
    } else if (payload == "tiktok") {
      //payload send top trending tiktok
      await sendTiktokTrend(sender_psid);
    } else if (payload == "dichav") {
      //payload send top trending tiktok
      await replyTranslate(sender_psid);
    } else if (payload.includes("keytiktok")) {
      //payload send video tiktok
      const urlVideo = payload.slice(10);
      await sendVideo(sender_psid, urlVideo);
    } else if (payload.includes("keymusic")) {
      //payload send audio music
      const key = payload.slice(9);
      let data = await ZingMp3.getFullInfo(key);
      const streamUrl = data.streaming;

      if (streamUrl) {
        const urlMp3 = streamUrl["128"];
        if (userIsRoom != null) {
          await sendRepQuick(sender_psid, "shareMusic", urlMp3);
        }
        setTimeout(async () => {
          await sendAudio(sender_psid, urlMp3);
        }, 5000);
      } else {
        let response = {
          text: `[BOT Music] 📍 Bài hát không có audio. Vui lòng chọn bài khác. `,
        };
        await callSendAPI(sender_psid, response);
      }
    }
  } catch (error) {
    console.log(error);
    let message = {
      text: `[BOT Lỗi] Lỗi Hệ Thống Vui Lòng Thử lại.`,
    };
    await callSendAPI(sender_psid, message);
  }
}

module.exports = handlePostback;
