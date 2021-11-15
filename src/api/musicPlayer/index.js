const { handleMusic } = require("./menuMusic");
const Nhaccuatui = require("nhaccuatui-api");
const _ = require("lodash");
const callSendAPI = require("../callApi");
const axios = require("axios");
const ZingMp3 = require("zingmp3-api");

const addMusicToMenu = async (musics) => {
  let musicArr = [];
  musics.map((music) => {
      let musicName = music.title ? music.title : "Bài hát bản quyền";
      let musicSinger = music.artistsNames
        ? music.artistsNames
        : "Bài hát bản quyền";
      let songKey = music.encodeId;

      let musicObj = {
        title: `${musicName} - ${musicSinger}`,
        subtitle: "Hãy gửi cho bạn đã ghép. Nếu muốn bạn ấy nghe cùng 💓",
        image_url: music.thumbnailM
          ? music.thumbnailM
          : "http://static.ybox.vn/2017/7/25/1b51520a-70e2-11e7-a080-2e995a9a3302.jpg",
        buttons: [
          {
            type: "postback",
            title: `${musicName} - ${musicSinger}`,
            payload: `keymusic ${songKey}`,
          },
        ],
      };
      musicArr.push(musicObj);
    });

  return musicArr;
};

const getMusic = async (sender_psid) => {
  try {
    let data = await ZingMp3.getWeekChart('IWZ9Z08I');
    const musicRank = _.slice(data.items, 0, 10);
    let musicArr = await addMusicToMenu(musicRank);
    await handleMusic(sender_psid, musicArr);
  } catch (e) {
    console.log(e.message);
    let message = {
      text: `[BOT Lỗi] Lỗi Hệ Thống Vui Lòng Thử lại.`,
    };
    await callSendAPI(sender_psid, message);
  }
};

const replyMusic = async (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "[BOT MUSIC] 🎼 Bạn muốn tìm kiếm bài hát",
            subtitle: `Cú pháp: "music" + "tên bài hát". ️🎯 VD: music lạc trôi`,
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

const searchMusic = async (sender_psid, received_message) => {
  try {
    const word = received_message.text;
    
    let response = await ZingMp3.search(String(word));

    const count = response.counter.song;
    if (count > 0) {
      const listSong = _.slice(response.songs, 0, 10);
      let musicArr = await addMusicToMenu(listSong);
      await handleMusic(sender_psid, musicArr);
    } else {
      let message = {
        text: `[BOT MUSIC] 🎼 Không tìm thấy bài hát bạn yêu cầu.`,
      };
      await callSendAPI(sender_psid, message);
    }
  } catch (e) {
    console.log(e);
    let message = {
      text: `[BOT Lỗi] Lỗi Hệ Thống Vui Lòng Thử lại.`,
    };
    await callSendAPI(sender_psid, message);
  }
};

module.exports = {
  getMusic: getMusic,
  replyMusic: replyMusic,
  searchMusic: searchMusic,
};
