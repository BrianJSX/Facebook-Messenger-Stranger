const callSendAPI = require("../../api/callApi");

const SendTemplateCustom = async (sender_psid, title, subtitle) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: title,
            subtitle: subtitle,
          },
        ],
      },
    },
  };
  await callSendAPI(sender_psid, response);
};

module.exports = SendTemplateCustom;
