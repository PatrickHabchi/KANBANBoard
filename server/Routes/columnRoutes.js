const express = require("express");
const router = express.Router();
const controller = require("../Controllers/columnController");


router.get("/getAllColumns", controller.list);
router.post("/createColumn", controller.create);

module.exports = router;