const express = require("express");
const { body, param, validationResult } = require("express-validator");
const controller = require("../Controllers/columnController");
const router = express.Router();

const checkErrors = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() });
  }
  next();
};

router.get("/getAllColumns", controller.list);


router.post(
  "/createColumn",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Column title is required"),
  ],
  checkErrors,
  controller.create
);


router.delete(
    "/deleteColumn/:id",       
    [
      param("id").isInt({ gt: 0 }).withMessage("Invalid column id")
    ],
    checkErrors,
    controller.delete
  );
  

module.exports = router;