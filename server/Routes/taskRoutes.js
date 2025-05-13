const express = require("express");
const router = express.Router();
const controller = require("../Controllers/taskController");

router.get("/getTasks", controller.list);
router.post("/createTask", controller.create);
router.put("/updateTask/:id", controller.update);
router.delete("/deleteTask/:id", controller.delete);


module.exports = router;