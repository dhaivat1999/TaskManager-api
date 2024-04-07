const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  completed: {
    type: Boolean,
    default: false
  },
  targetCompletionDate: {
    type: Date
  },
  category: String,
  priority: String,
  creationDate: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Task', taskSchema);
