const Room = require("../api/chat/pair");
const callSendAPI = require("./callApi");
const handleImage = require("./chat/handleImage");
const textChat = require("./chat/textChat");
const requestApiGet = require("./requestApi");
const sendAudio = require("./sendAudio");
const { getMusic, replyMusic } = require("./musicPlayer");
const { sendTiktokTrend } = require("./tiktok");
const sendVideo = require("./sendVideo");
const sendRepQuick = require("./sendRepQuick");
const { replyTranslate } = require("./translate");
const UserModel = require("../app/Models/User");
const RoomModel = require("../app/Models/Room");
const ZingMp3 = require("zingmp3-api");
const handlePhotoProfile = require("./photoProfile");
const { sendRepQuickSchedule } = require("./scheduleHutech");
const { sendRepQuickBlock } = require("./block");
const { unBlockUser } = require("./unblock");


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
      //payload click button
      if (userIsRoom == null) {
        await textChat.handleUser(sender_psid, payload);
      } else {
        console.log("start");
      }
    } else if (payload === "end") {
      //payload click button end
      await sendRepQuick(
        sender_psid,
        "yesEnd",
        "chat",
        "[BOT] Bạn có muốn kết thúc không ??"
      );
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
    } else if (payload == "photo") {
      await handlePhotoProfile(sender_psid);
    } else if (payload == "tkb") {
      await sendRepQuickSchedule(sender_psid);
    } else if (payload == "block") {
      if (userIsRoom != null) {
        //find Room have p1 or p2 is sender_psid
        let userConnect = await RoomModel.findOne({
          $or: [{ p1: sender_psid }, { p2: sender_psid }],
        });

        if (userConnect.p2 == null) {
          //send message no user pair
          console.log("đang đợi bot ghép bạn vui lòng chờ");
        } else {
          if (userConnect.p1 == sender_psid) {
            //send uid p2
            await sendRepQuickBlock(sender_psid, userConnect.p2);
          } else {
            //send uid p1
            await sendRepQuickBlock(sender_psid, userConnect.p1);
          }
        }
      } else {
        console.log("không có phòng");
      }
    } else if (payload == "unblock") {
      await unBlockUser(sender_psid);
    } else if (payload.includes("keytiktok")) {
      //payload send video tiktok
      const urlVideo = payload.slice(10);
      if (userIsRoom != null) {
        await sendRepQuick(sender_psid, "shareTiktok", urlVideo);
      }
      setTimeout(async () => {
        await sendVideo(sender_psid, urlVideo);
      }, 5000);
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
