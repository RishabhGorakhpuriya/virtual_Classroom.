const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  units: [{
    title: String,
    sessions: [{
      title: String,
      lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }]
    }]
  }]
});

module.exports = mongoose.model('Class', ClassSchema);
