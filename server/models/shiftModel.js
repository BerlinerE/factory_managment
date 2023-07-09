const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startingHour: { type: Number, required: true },
  endingHour: { type: Number, required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'employee' },
],
},
{timestamps: true }
);

const Shift = mongoose.model('shift', shiftSchema, 'shifts');

module.exports = Shift;