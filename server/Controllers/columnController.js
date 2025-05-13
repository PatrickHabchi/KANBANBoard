const columnModel = require("../Models/columnModel");

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
        res.status(200).json({
            success: true,
            message: "Column created successfully",
            payload: column
        });
    } catch (err) {
        next(err);
    }
}
