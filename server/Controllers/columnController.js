const columnModel = require("../Models/columnModel");
const logModel    = require("../Models/logModel");

exports.list = async (req, res, next) => {
    try {
        const columns = await columnModel.getAllColumns();
        res.json({payload: columns});
    } catch (err) {
        next(err);
    }
}

exports.create = async (req, res, next) => {
  try {
    const { title, payload = {}, updated = {} } = req.body;

    const column = await columnModel.createColumn(title);

    await logModel.createLog(
      null,
      `Created column "${column.title}"`
    );

    if (payload.column_id !== undefined) {
      const col = await columnModel.getColumnById(payload.column_id);
      await logModel.createLog(
        updated.id,
        `Moved "${updated.title}" to column "${col.title}" at position ${updated.position}`
      );

    } else if (updated.id !== undefined) {
      await logModel.createLog(
        updated.id,
        `Edited "${updated.title}"`
      );
    }

    res.status(200).json({
      success: true,
      message: "Column created successfully",
      payload: column
    });

  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const original = await columnModel.getColumnById(id);
    if (!original) {
      return res.status(404).json({
        success: false,
        message: `Column with id ${id} not found`
      });
    }

    await logModel.createLog(
      null,
      `Deleted column "${original.title}"`
    );

    const deleted = await columnModel.deleteColumn(id);

    res.status(200).json({ success: true, payload: deleted });
  } catch (err) {
    next(err);
  }
};