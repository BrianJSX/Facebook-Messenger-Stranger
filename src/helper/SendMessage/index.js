const callSendAPI = require("../../api/callApi");
const handleImage = require("../../api/chat/handleImage");
const sendAudio = require("../../api/sendAudio");
const sendVideo = require("../../api/sendVideo");
const sendFile = require("../../api/sendFile");


const SendMessage = async (received_message, userConnect) => {
  if (received_message.text == null) {
    let file = received_message.attachments;
    let type = file[0].type;

    if (type == "image") {
      file.map((data) => {
        handleImage(userConnect, data.payload.url);
      });
    } else if (type == "audio") {
      file.map((data) => {
        sendAudio(userConnect, data.payload.url);
      });
    } else if (type == "video") {
      file.map((data) => {
        sendVideo(userConnect, data.payload.url);
      });
    } else if (type == "file") {
      file.map((data) => {
        sendFile(userConnect, data.payload.url);
      });
    }
  } else {
    let response = {
      text: `${received_message.text}`,
    };
    await callSendAPI(userConnect, response);
  }
};

module.exports = SendMessage;
