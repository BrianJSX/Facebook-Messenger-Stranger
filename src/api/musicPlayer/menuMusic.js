const callSendAPI = require("../callApi");

const handleMusic = async (sender_psid, data) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: data,
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

module.exports = {
  handleMusic: handleMusic,
};
