const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  replies: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String }]
}, { timestamps: true });

const LectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [CommentSchema]
});

module.exports = mongoose.model('Lecture', LectureSchema);
