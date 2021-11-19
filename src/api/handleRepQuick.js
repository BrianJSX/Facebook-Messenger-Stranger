
const shareMusic = require("../api/shareMusic");
const shareDogCat = require("../api/shareDogCat");
const shareTiktok = require("../api/shareTiktok");


async function handleRepQuick(sender_psid, message) {
  let payload = message.quick_reply.payload;

  if (payload.includes("shareMusic")) {
    let urlMusic = payload.slice(11);
    shareMusic(sender_psid, urlMusic);
  } else if(payload.includes("shareDogCat")) {
    let urlImage = payload.slice(12);
    shareDogCat(sender_psid, urlImage);
  } else if(payload.includes("shareTiktok")) { 
    let urlVideo = payload.slice(12);
    shareTiktok(sender_psid, urlVideo);
  }
  
}

module.exports = handleRepQuick;
