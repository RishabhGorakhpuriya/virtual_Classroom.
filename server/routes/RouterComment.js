const express = require('express');
const router = express.Router();

const { addComment, getComments, replyToComment} = require('../controller/Comment');
const { authenticate } = require('../middlware/authenticate');

// Add a comment to a lecture
router.post('/:lectureId/comments', authenticate, addComment);

// Get all comments on a lecture
router.get('/:lectureId/comments', getComments);

// Reply to a comment
router.post('/comments/:commentId/replies', authenticate, replyToComment);

module.exports = router;
