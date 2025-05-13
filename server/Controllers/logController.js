const logModel = require("../Models/logModel");

exports.list = async (req, res, next) => {
  try {
    const logs = await logModel.getAllLogs();
    res.status(200).json({ payload: logs });
  } catch (err) { 
    next(err); 
  }
};

exports.create = async (req, res, next) => {
  try {
    const { task_id, action } = req.body;
    const log = await logModel.createLog(task_id, action);
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};