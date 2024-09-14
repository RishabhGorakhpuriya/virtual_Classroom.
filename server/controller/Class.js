const Class = require('../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
    try {
        const newClass = new Class({
            ...req.body,
            instructor: req.user._id // Set instructor to authenticated user
        });
        await newClass.save();
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a class by ID
exports.getClassById = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id);
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json(classData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a class by ID
exports.updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json(updatedClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a class by ID
exports.deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
