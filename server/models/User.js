const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], required: true, default: 'student' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
});

// Virtual field for id
userSchema.virtual('id').get(function() {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('User', userSchema);
