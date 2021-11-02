const callSendAPI = require("../callApi");
const TikTokScraper = require("tiktok-scraper");
const { handleTiktok } = require("./menuTiktok");

//reply message
const replyTiktok = async (sender_psid) => {
  let response = {
    text: `[BOT TIKTOK] 🎵 Video gửi sẽ bị chậm vui lòng đợi trong giây lát....`,
  };
  await callSendAPI(sender_psid, response);
};

//add video to menu
const handleVideo = async () => {
  const videoArr = [];

  const posts = await TikTokScraper.trend("", {
    number: 10,
    sessionList: ["sid_tt=58ba9e34431774703d3c34e60d584475;"],
  });
  const data = posts.collector.map((item, index) => {
    let videoObj = {
      title: `${item.authorMeta.name} - ${item.authorMeta.nickName}`,
      image_url: item.covers.dynamic,
      buttons: [
        {
          type: "postback",
          title: `${item.musicMeta.musicAuthor}`,
          payload: `keytiktok ${item.videoUrl}`,
        },
      ],
    };
    videoArr.push(videoObj);
  });

  return videoArr;
};

//send video to user
const sendTiktokTrend = async (sender_psid) => {
  await replyTiktok(sender_psid);
  const posts = await handleVideo();
  await handleTiktok(sender_psid, posts);
};

module.exports = {
  sendTiktokTrend: sendTiktokTrend,
};
