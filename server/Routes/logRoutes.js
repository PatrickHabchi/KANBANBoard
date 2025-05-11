const express = require("express");
const controller = require("../Controllers/logController");
const router = require("./columnRoutes");

router.get("/", controller.list);

module.exports = router;