const tagModel = require("../Models/tagModel");
const logModel    = require("../Models/logModel");

exports.list = async (req, res, next) => {
  try {
    const tags = await tagModel.getAllTags();
    res.status(200).json({ payload: tags });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const tag = await tagModel.createTag(req.body.name);


    res.status(200).json({ payload: tag });
  } catch (err) { next(err); }
};
