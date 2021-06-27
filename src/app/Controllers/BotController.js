const handleMessage = require("../../api/handleMessage");
const handlePostback = require("../../api/handlePostback");
require("dotenv").config();

const verifyToken = process.env.VERIFY_TOKEN;

class BotController {
  //get HomePage
  getHomePage(req, res) {
    res.send("hello dev onionsmit ( HO MINH )");
  }
  
  //get webHook
  getWebhook(req, res) {
    let VERIFY_TOKEN = verifyToken;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  //post getHook
  postWebhook(req, res) {
    let body = req.body;
    if (body.object === "page") {
      body.entry.forEach(function (entry) {
        let webhook_event = entry.messaging[0];
        let sender_psid = webhook_event.sender.id;
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  }

}
module.exports = new BotController();
