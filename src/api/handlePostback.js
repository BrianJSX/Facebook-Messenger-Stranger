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

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  try {
    let payload = received_postback.payload;

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
    } else if (payload === "cat") {
      //payload send image cat
      let data = await requestApiGet(
        "https://api.thecatapi.com/v1/images/search"
      );
      await handleImage(sender_psid, String(data[0].url));
    } else if (payload == "covid") {
      //payload send data covid
      let response = {
        text: `[BOT COVID] 📍 Vui lòng nhập "kcovid" + tên "TP hoặc Tỉnh" để xem thống kê số ca tại khu vực. ♻️ `,
      };
      let response1 = {
        text: `[BOT COVID] 📍 Ví dụ: kcovid Bình Dương. `,
      };
      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response);
    } else if (payload.includes("keymusic")) {
      //payload send audio music
      const key = payload.slice(9);
      let data = await Nhaccuatui.getSong(String(key));
      const streamUrl = data.song.streamUrls;

      if (streamUrl.length > 0) {
        const urlMp3 = data.song.streamUrls[0].streamUrl;
        await sendAudio(sender_psid, urlMp3);
      } else {
        let response = {
          text: `[BOT Music] 📍 Bài hát không có audio. Vui lòng chọn bài khác. `,
        };
        await callSendAPI(sender_psid, response);
      }
    } else if (payload == "music") {
      //payload send top trending music
      await replyMusic(sender_psid);
      await getMusic(sender_psid, received_postback);
    } else if (payload == "tiktok") {
      //payload send top trending tiktok
      await sendTiktokTrend(sender_psid);
    } else if (payload.includes("keytiktok")) {
      //payload send video tiktok
      const urlVideo = payload.slice(10);
      console.log(payload.slice(11))
      let response = {
        text: `[BOT TIKTOK] 🎵 Waiting! video sẽ được gửi trong giây lát...`,
      };
      await handleImage(
        sender_psid,
        "https://i.pinimg.com/originals/71/3a/32/713a3272124cc57ba9e9fb7f59e9ab3b.gif"
      );
      await callSendAPI(sender_psid, response);
      await sendVideo(sender_psid, urlVideo);
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
