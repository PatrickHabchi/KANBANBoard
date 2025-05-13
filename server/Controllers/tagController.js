const tagModel = require("../Models/tagModel");

exports.list = async (req, res, next) => {
    try {
        const tags = await tagModel.getAllTags();

        res.json({payload: tags});
    } catch (err) {
        next(err);
    } 
}

exports.create = async (req, res, next) => {
    try {
        const { name, color } = req.body;
        const tag = await tagModel.createTags(name, color);
        res.status(200).json({
            success: true,
            message: "Tag created successfully",
            data: tag
        });
    } catch (err) {
        next(err);
    }
}