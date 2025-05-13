const taskModel = require("../Models/taskModel");
const logModel = require("../Models/logModel");

exports.list = async (req, res, next) => {
  try {
    const tasks = await taskModel.getAllTasks();  
    res.status(200).json({payload: tasks});                  
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
    try {
        const task = await taskModel.createTask(req.body);
        await logModel.createLog(task.id, `Created task "${task.title}"`);
        res.status(200).json({ 
            _status: 200,
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.update = async (req, res, next) => {
    try {
        const task = await taskModel.updateTask(req.params.id, req.body);
        await logModel.createLog(
            task.id,
            `Moved "${task.title}" to column ${task.column_id} at position ${task.position}`
        );
        res.status(200).json({
            success: true,
            message: "Task updated successfully"
        });
    } catch (err) {
        next(err);
    }
};

