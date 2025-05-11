const express = require("express");
const router = express.Router();
const controller = require("../Controllers/tagController");

router.get("/", controller.list);
router.post("/", controller.create);

module.exports = router;
