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
  category: String, // Adding category field
  priority: String // Adding priority fieldasdasd
});

module.exports = mongoose.model('Task', taskSchema);