const { handleMusic } = require("./menuMusic");
const requestApi = require("../requestApi");
const Nhaccuatui = require("nhaccuatui-api");
const _ = require("lodash");
const callSendAPI = require("../callApi");
const axios = require("axios");

const addMusicToMenu = async (musics) => {
  let musicArr = [];
  let regex = /\w\.\w{12}/;

  if (musics[0].url != null) {
    musics.map(music => {
      let match = music.url.match(regex);
      let key = match[0].slice(2);

      let musicName = music.name;
      let musicSinger = music.singer[0].name;
      let songKey = key;

      let musicObj = {
        title: `${musicName} - ${musicSinger}`,
        image_url: music.thumbnail,
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
  } else {
    musics.map((music) => {
      let musicName = music.title;
      let musicSinger = music.artists[0].name;
      let songKey = music.songKey;

      let musicObj = {
        title: `${musicName} - ${musicSinger}`,
        image_url: music.thumbnail,
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
  }

  return musicArr;
};

const getMusic = async (sender_psid, received_message) => {
  try {
    let data = await Nhaccuatui.getTop20();
    const musicRank = _.slice(data.ranking.song, 0, 10);
    let musicArr = await addMusicToMenu(musicRank);
    await handleMusic(sender_psid, musicArr);
  } catch (e) {
    console.log(e);
    let message = {
      text: `[BOT Lỗi] Lỗi Hệ Thống Vui Lòng Thử lại.`
    }
    await callSendAPI(sender_psid, message)
  }
};

const replyMusic = async (sender_psid) => {
  let response = {
    text: `[BOT MUSIC] 🎼 tìm kiếm nhạc nhập "music" + "tên bài hát". ️🎯 ví dụ: music lạc trôi`,
  };
  await callSendAPI(sender_psid, response);
};

const searchMusic = async (sender_psid, received_message) => {
  try {
    const word = received_message.text;
    const keyword = encodeURI(word.slice(6));
    let response = await axios.get(
      `https://www.nhaccuatui.com/ajax/search?q=${keyword}`
    );
    const song = response.data.data.song;
    if(song.length > 0) {
      const listSong = _.slice(song, 0, 10);
      let musicArr = await addMusicToMenu(listSong);
      await handleMusic(sender_psid, musicArr);
    } else { 
      let message = {
        text: `[BOT MUSIC] 🎼 Không tìm thấy bài hát bạn yêu cầu.`
      }
      await callSendAPI(sender_psid, message)
    }
  } catch (e) {
    console.log(e);
    let message = {
      text: `[BOT Lỗi] Lỗi Hệ Thống Vui Lòng Thử lại.`
    }
    await callSendAPI(sender_psid, message)
  }
};

module.exports = {
  getMusic: getMusic,
  replyMusic: replyMusic,
  searchMusic: searchMusic,
};
