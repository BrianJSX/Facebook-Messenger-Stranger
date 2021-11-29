const User = require("../../app/Models/User");
const Room = require("../../app/Models/Room");
const requestApiGet = require("../requestApi");
const { sendUserPairNull, sendUserRoomEmpty, sendUserPhotoPair } = require("./handleMessage");

//handle send photo user pair
const handlePhotoProfile = async (sender_psid) => {
  //check Room of user is empty
  let userIsRoom = await User.findOne({
    messenger_id: sender_psid,
    state: 1,
  });
  
  if (userIsRoom != null) {
    let userConnect = await Room.findOne({
      $or: [{ p1: sender_psid }, { p2: sender_psid }],
    });

    if (userConnect.p2 == null) {
        //user p2 is null
      sendUserPairNull(sender_psid);
    } else {
        if(userConnect.p1 == sender_psid) { 
            //send photo p2 => p1
            let data = await handleUserInfo(userConnect.p2);
            sendUserPhotoPair(sender_psid, data);
        } else {
            let data = await handleUserInfo(userConnect.p1);
            sendUserPhotoPair(sender_psid, data);
        }
    }
  } else {
      //sendUserRoomEmpty
      sendUserRoomEmpty(sender_psid);
  }
};

//get data info user
const handleUserInfo = async (sender_psid) => {
  let url = `https://graph.facebook.com/${sender_psid}?fields=id,first_name,last_name,profile_pic,gender,locale&access_token=${process.env.PAGE_ACCESS_TOKEN}"`;
  let data = await requestApiGet(url);
  return data;
};

module.exports = handlePhotoProfile;
