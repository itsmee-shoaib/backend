const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    semester:{type:Number,required:true},
    regNo:{type:String,required:true},
    role: { type: String, enum: ['student', 'admin'] },
    quizScores: [{
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }, // Reference to the quiz
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, // Reference to the subject
        score: { type: Number, required: true }, // User's score
        totalQuestions: { type: Number, required: true }, // Total questions in the quiz
        attemptedAt: { type: Date, default: Date.now } // Timestamp of when the quiz was attempted
    }],
})

module.exports = mongoose.model('User', UserSchema);
