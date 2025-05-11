const logModel = require("../Models/logModel");

exports.list = async (req, res, next) => {
  try {
    const logs = await logModel.getAllLogs();
    res.json(logs);
  } catch (err) { 
    next(err); 
  }
};
