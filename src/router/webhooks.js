const express = require("express");
const router =  express.Router();
const BotController =  require("../app/Controllers/BotController");

router.get("/", BotController.getHomePage);
router.get("/webhook", BotController.getWebhook);
router.post("/webhook", BotController.postWebhook);

module.exports = router;