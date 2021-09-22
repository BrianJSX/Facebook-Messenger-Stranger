const callSendAPI = require("../callApi");

const handleMusic = async (sender_psid, received_message) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Welcome!",
            image_url: "https://png.pngtree.com/thumb_back/fh260/background/20200731/pngtree-blue-carbon-background-with-sport-style-and-golden-light-image_371487.jpg",
            buttons: [
              {
                type: "postback",
                title: "💯 Tìm bạn là Nam. 👦",
                payload: "male",
              },
            ],
          },
          {
            title: "Welcome!",
            buttons: [
              {
                type: "postback",
                title: "💯 Tìm bạn là Nam. 👦",
                payload: "male",
              },
            ],
          },
          {
            title: "Welcome!",
            buttons: [
              {
                type: "postback",
                title: "💯 Tìm bạn là Nam. 👦",
                payload: "male",
              },
            ],
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

const getMusic = async () => { 
  console.log("music player")
}

module.exports = {
  handleMusic: handleMusic,
};
