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
        const { title } = req.body;

        const column = await columnModel.createColumn(title);

        await logModel.createLog(
            null,
            `Created column "${col.title}"`
          );

          if (payload.column_id !== undefined) {
            const col = await columnModel.getColumnById(payload.column_id);
            await logModel.createLog(
              updated.id,
              `Moved "${updated.title}" to column "${col.title}" at position ${updated.position}`
            );
          }

          else {
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
}
