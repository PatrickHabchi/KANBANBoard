const express = require("express");
const ctrl    = require("../Controllers/tagController");
const router  = express.Router();

router.get("/getTags",  ctrl.list);  
router.post("/createTag", ctrl.create);  

module.exports = router;
