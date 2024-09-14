const Lecture = require('../models/Lecture');
const User = require('../models/User'); // Assuming User model exists


// POST /api/lectures/comments
exports.addComment = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { content } = req.body;
        const author = req.user._id; // Assuming user is authenticated

        const newComment = { author, content };

        const lecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        res.status(201).json(lecture.comments[lecture.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/lectures/comments
exports.getComments = async (req, res) => {
    try {
        const { lectureId } = req.params;
        
        const lecture = await Lecture.findById(lectureId).populate('comments.author');
        
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
        
        res.status(200).json(lecture.comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/comments/replies
exports.replyToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const user = req.user._id; // Assuming user is authenticated

        const reply = { user, text };

        const lecture = await Lecture.findOneAndUpdate(
            { 'comments._id': commentId },
            { $push: { 'comments.$.replies': reply } },
            { new: true }
        );

        if (!lecture) return res.status(404).json({ message: 'Comment not found' });

        res.status(201).json(lecture.comments.id(commentId).replies[lecture.comments.id(commentId).replies.length - 1]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
