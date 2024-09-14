const express = require('express');
const router = express.Router();
const unitController = require('../controller/Units');
const { authenticate, authorize } = require('../middlware/authenticate');

// Get units of a class
router.get('/:classId/units', authenticate, unitController.getUnits);

// Create a new unit
router.post('/:classId/units', authenticate, authorize('instructor'), unitController.createUnit);

// Update a unit
router.put('/:classId/units/:unitId', authenticate, authorize('instructor'), unitController.updateUnit);

// Delete a unit
router.delete('/:classId/units/:unitId', authenticate, authorize('instructor'), unitController.deleteUnit);

module.exports = router;
