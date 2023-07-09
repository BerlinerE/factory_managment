const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    startWorkYear: { type: Number, required: true },
    departmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'department', required: true },
    isManager: {type: Boolean,required: false},
    shifts : [{type: mongoose.Schema.Types.ObjectId, ref: "shift"},
  ],
  },
  {timeseries: true});
  
  const Employee = mongoose.model('employee', employeeSchema, 'employees');
  
  module.exports = Employee;




