const express = require('express');
const { createUser, loginUser, enrollUser, getUserById} = require('../controller/Auth');
const { authenticate, authorize } = require('../middlware/authenticate'); // Correct the path if necessary
const router = express.Router();

router.post('/auth/signup', createUser);
router.post('/auth/login', loginUser);
router.post('/enroll/:classId', authenticate, enrollUser);
router.get('/user/:id', authenticate, getUserById);
module.exports = router;
