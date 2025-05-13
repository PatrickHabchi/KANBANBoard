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
        res.status(200).json({ 
            _status: 200,
            success: true,
            message: "Task created successfully",
            payload: task
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.update = async (req, res, next) => {
    try {
        const id      = req.params.id;
        const payload = req.body;

        const original = await taskModel.getTaskById(id);

        const updated = await taskModel.updateTask(id, payload);

        const col = await columnModel.getColumnById(updated.column_id);

        let action;
    
        if (payload.column_id !== undefined && payload.column_id !== original.column_id) {
          action = `Moved "${updated.title}" to column "${col.title}"`;
    
        } else if (payload.position !== undefined && payload.position !== original.position) {
          if (payload.position < original.position) {
            action = `"${updated.title}" was moved up within the "${col.title}" column`;
          } else {
            action = `"${updated.title}" was moved down within the "${col.title}" column`;
          }
    
        } else if (
          (payload.title !== undefined && payload.title !== original.title) ||
          (payload.description !== undefined && payload.description !== original.description)
        ) {
          action = `Edited task "${updated.title}"`;
        }
    
        if (action) {
          await logModel.createLog(updated.id, action);
        }
    
  
      res.status(200).json({
        success: true,
        data: updated
      });
  
    } catch (err) {
      next(err);
    }
  };

  exports.delete = async (req, res, next) => {
    try {
      const id = req.params.id;

      const deleted = await taskModel.deleteTask(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Task with id ${id} not found`
        });
      }
      await logModel.createLog(
        deleted.id,
        `Deleted task "${deleted.title}"`
      );
  
      // 4) Return the deleted row
      res.status(200).json({
        success: true,
        data: deleted
      });
  
    } catch (err) {
      console.error("Error in delete controller:", err);
      next(err);
    }
  };

