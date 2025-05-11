const tagModel = require("../Models/tagModel");

exports.list = async (req, res, next) => {
    try {
        const tags = await tagModel.getAllTags();

        res.json(tags);
    } catch (err) {
        next(err);
    } 
}

exports.create = async (req, res, next) => {
    try {
        const { name, color } = req.body;
        const tag = await tagModel.createTags(name, color);
        res.status(201).json(tag);
    } catch (err) {
        next(err);
    }
}