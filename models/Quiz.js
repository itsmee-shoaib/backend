// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }]
  }]
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
