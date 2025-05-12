const columnModel = require("../Models/columnModel");

exports.list = async (req, res, next) => {
    try {
        const columns = await columnModel.getAllColumns();
        res.json(columns);
    } catch (err) {
        next(err);
    }
}

exports.create = async (req, res, next) => {
    try {
        const { title } = req.body;

        const column = await columnModel.createColumn(title);
        res.status(201).json(column);
    } catch (err) {
        next(err);
    }
}
