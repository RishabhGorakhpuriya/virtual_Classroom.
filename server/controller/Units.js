const Class = require('../models/Class');
const { authenticate } = require('../middlware/authenticate');

// Get units of a class
exports.getUnits = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classData = await Class.findById(classId).select('units');
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json(classData.units);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new unit
exports.createUnit = async (req, res) => {
    try {
        const classId = req.params.classId;
        const { title, sessions } = req.body;

        const newUnit = { title, sessions };

        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $push: { units: newUnit } },
            { new: true }
        );

        if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
        res.status(201).json(newUnit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a unit
exports.updateUnit = async (req, res) => {
    try {
        const classId = req.params.classId;
        const unitId = req.params.unitId;
        const { title, sessions } = req.body;

        const updatedClass = await Class.findOneAndUpdate(
            { _id: classId, 'units._id': unitId },
            { $set: { 'units.$.title': title, 'units.$.sessions': sessions } },
            { new: true }
        );

        if (!updatedClass) return res.status(404).json({ message: 'Class or Unit not found' });
        res.status(200).json(updatedClass.units.id(unitId));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a unit
exports.deleteUnit = async (req, res) => {
    try {
        const classId = req.params.classId;
        const unitId = req.params.unitId;

        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $pull: { units: { _id: unitId } } },
            { new: true }
        );

        if (!updatedClass) return res.status(404).json({ message: 'Class or Unit not found' });
        res.status(200).json({ message: 'Unit deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
