const express = require('express');
const router = express.Router();

const {getLectures,addLecture,updateLecture,deleteLecture, addOnlyLecture} = require('../controller/Session');
const { authenticate } = require('../middlware/authenticate');

// Get lectures of a session
router.get('/:sessionId/lectures', authenticate, getLectures);

// Add a lecture to a session
router.post('/:sessionId/lectures', authenticate, addLecture);

router.post('/lectures', authenticate, addOnlyLecture);

// Update a lecture
router.put('/:sessionId/lectures/:lectureId', authenticate, updateLecture);

// Delete a lecture
router.delete('/:sessionId/lectures/:lectureId', authenticate, deleteLecture);

module.exports = router;
