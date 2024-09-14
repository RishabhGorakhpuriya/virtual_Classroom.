const Class = require('../models/Class');
const Lecture = require('../models/Lecture');

// GET /api/sessions/:sessionId/lectures
exports.getLectures = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const classDoc = await Class.findOne({ 'units.sessions._id': sessionId }).populate('units.sessions.lectures');
        
        if (!classDoc) return res.status(404).json({ message: 'Session not found' });
        
        const session = classDoc.units.flatMap(unit => 
            unit.sessions.find(s => s._id.toString() === sessionId)
        );

        if (!session) return res.status(404).json({ message: 'Session not found in class' });
        
        const lectures = await Lecture.find({ _id: { $in: session[0].lectures } });
        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/sessions/:sessionId/lectures
exports.addLecture = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { title, content } = req.body;

        const newLecture = new Lecture({ title, content });
        await newLecture.save();

        const updatedClass = await Class.findOneAndUpdate(
            { 'units.sessions._id': sessionId },
            { $push: { 'units.$.sessions.$[session].lectures': newLecture._id } },
            { arrayFilters: [{ 'session._id': sessionId }], new: true }
        );

        if (!updatedClass) return res.status(404).json({ message: 'Session or Class not found' });
        res.status(201).json(newLecture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addOnlyLecture = async(req, res)=>{
    try {
        const { title, content } = req.body;
        const newLecture = new Lecture({ title, content });
        await newLecture.save();
        res.status(201).json(newLecture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/sessions/:sessionId/lectures/:lectureId
exports.updateLecture = async (req, res) => {
    try {
        const { sessionId, lectureId } = req.params;
        const { title, content } = req.body;

        const updatedLecture = await Lecture.findByIdAndUpdate(lectureId, { title, content }, { new: true });

        if (!updatedLecture) return res.status(404).json({ message: 'Lecture not found' });

        res.status(200).json(updatedLecture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/sessions/:sessionId/lectures/:lectureId
exports.deleteLecture = async (req, res) => {
    try {
        const { sessionId, lectureId } = req.params;

        // Remove lecture from Class
        const updatedClass = await Class.findOneAndUpdate(
            { 'units.sessions._id': sessionId },
            { $pull: { 'units.$.sessions.$[session].lectures': lectureId } },
            { arrayFilters: [{ 'session._id': sessionId }], new: true }
        );

        if (!updatedClass) return res.status(404).json({ message: 'Session or Class not found' });

        // Remove lecture document
        await Lecture.findByIdAndDelete(lectureId);

        res.status(200).json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
