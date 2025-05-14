const express    = require("express");
const { body, param, validationResult } = require("express-validator");
const controller = require("../Controllers/taskController");
const router     = express.Router();


const checkErrors = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() });
  }
  next();
};

router.get(
  "/getTasks",
  controller.list
);

router.post(
  "/createTask",
  [
    body("title")
      .trim()
      .notEmpty().withMessage("Title is required"),
    body("description")
      .optional()
      .isString().withMessage("Description must be text"),
    body("column_id")
      .isInt({ gt: 0 }).withMessage("column_id must be a positive integer"),
      body("tag_id")
      .optional({ nullable: true })         
      .isInt({ gt: 0 }).withMessage("tag_id must be a positive integer"),
    
  ],
  checkErrors,
  controller.create
);


router.put(
    "/updateTask/:id",
    [
      param("id")
        .isInt({ gt: 0 })
        .withMessage("Task ID must be a positive integer"),
  
      body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("If provided, title cannot be empty"),
  
      body("description")
        .optional()
        .isString(),
  
      body("column_id")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("column_id must be a positive integer"),
  
      body("tag_id")
        .optional({ nullable: true })    
        .isInt({ gt: 0 })
        .withMessage("tag_id must be a positive integer"),
    ],
    checkErrors,
    controller.update
  );

router.delete(
  "/deleteTask/:id",
  [
    param("id")
      .isInt({ gt: 0 }).withMessage("Task ID must be a positive integer")
  ],
  checkErrors,
  controller.delete
);

module.exports = router;
