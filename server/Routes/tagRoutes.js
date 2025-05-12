const express = require("express");
const router = express.Router();
const controller = require("../Controllers/tagController");

router.get("/getTags", controller.list);
router.post("/createTags", controller.create);

module.exports = router;
