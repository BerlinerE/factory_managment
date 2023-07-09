const Employee = require('../models/employeeModel');
const Shift = require('../models/shiftModel');


const getAllEmployees = async  () => { 
    const employeeDB =  Employee.find({}).populate('departmentID'); 
     return await employeeDB
  };


const getEmployeeById = (id) => {
  return Employee.findById({ _id: id } );
};

const addEmployee = async (obj) => {
  const emp = new Employee(obj);
  await emp.save();
  return 'Created!';
};

const updateEmployee = async (id, obj) => {
  await Employee.findByIdAndUpdate(id, obj);
  return 'Updated!';
};

const deleteEmployee = async (id) => {
  await Employee.findByIdAndDelete(id);
  return 'Deleted!';
};


module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee };


