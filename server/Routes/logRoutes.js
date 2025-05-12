const express = require("express");
const controller = require("../Controllers/logController");
const router = require("./columnRoutes");

router.get("/getLogs", controller.list);

module.exports = router;