const express = require('express');
const router = express.Router();
const classController = require('../controller/Class');
const { authenticate, authorize } = require('../middlware/authenticate');

// Ensure the controller functions are correctly imported and exist
router.post('/createClass', authenticate, classController.createClass);   // Create class
router.get('/getClass', authenticate, classController.getAllClasses); // Get all classes
router.get('/getClassById/:id', authenticate, classController.getClassById); // Get a single class
router.put('/updateClassById/:id', authenticate, authorize(['instructor']), classController.updateClass); // Update a class
router.delete('/deleteClassById/:id', authenticate, authorize(['instructor']), classController.deleteClass); // Delete a class

module.exports = router;
