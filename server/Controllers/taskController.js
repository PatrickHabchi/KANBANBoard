const taskModel = require("../Models/taskModel");
const logModel = require("../Models/logModel");
const columnModel = require("../Models/columnModel");

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

        const fullTask = await taskModel.getTaskByIdWithTag(task.id);
        res.status(200).json({ 
            _status: 200,
            success: true,
            message: "Task created successfully",
            payload: fullTask
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.update = async (req, res, next) => {
  try {
    const id      = Number(req.params.id);
    const payload = req.body;

    const original = await taskModel.getTaskById(id);

    const task = await taskModel.updateTask(id, payload);
    if (!task) {
      return res.status(404).json({ success: false, message: `Task ${id} not found` });
    }

    const col = await columnModel.getColumnById(task.column_id);
    let action;
    if (payload.column_id !== undefined && payload.column_id !== original.column_id) {
      action = `Moved "${task.title}" to column "${col.title}"`;
    } else if (payload.position !== undefined && payload.position !== original.position) {
      action = payload.position < original.position
        ? `"${task.title}" was moved up within "${col.title}"`
        : `"${task.title}" was moved down within "${col.title}"`;
    } else if (
      (payload.title       && payload.title !== original.title) ||
      (payload.description && payload.description !== original.description)
    ) {
      action = `Edited task "${task.title}"`;
    }
    if (action) {
      await logModel.createLog(id, action);
    }

    const full = await taskModel.getTaskByIdWithTag(id);

    res.status(200).json({ success: true, payload: full });

  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const original = await taskModel.getTaskById(id);
    if (!original) {
      return res.status(404).json({
        success: false,
        message: `Task ${id} not found`
      });
    }
    await logModel.createLog(id, `Deleted task "${original.title}"`);
    const deleted = await taskModel.deleteTask(id);
    res.status(200).json({
      success: true,
      payload: deleted
    });
  } catch (err) {
    next(err);
  }
};