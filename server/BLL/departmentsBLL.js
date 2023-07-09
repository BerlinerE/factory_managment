
const Department = require('../models/departmentModel');
const Employee = require('../models/employeeModel');



const getAllDepartments = async () => {
    try {
      const departments = await Department.find().populate('manager');
      return departments;
    } catch (error) {
      console.error(error);
    }
  }

const getDepartmentById = (id) => {
    return Department.findById({ _id: id } );
  };
  

const addDepartment = async (obj) => {
  const dep = new Department(obj);
  await dep.save();
  return 'Created!';
};

const deleteDepartment = async (id) => {
  await Department.findByIdAndDelete(id);
  return 'Deleted!';
};

const updateDepartment = async (id, updatedDepartment) => {
  await Department.findByIdAndUpdate(id, updatedDepartment);
  return 'Updated!';
};

// Add an employee to a department
const addEmployeeToDepartment = async (departmentId, employeeId) => {
  try {
    // Find the department by ID
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new Error('Department not found');
    }

    // Check if the employee already belongs to a department
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (employee.department) {
      return { success: false, message: 'Employee already belongs to another department' };
    }

    // Add the employee to the department
    department.employees.push(employeeId);
    await department.save();

    // Update the employee's department field
    employee.department = departmentId;
    await employee.save();

    return { success: true, message: 'Employee added to the department successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add employee to the department');
  }
};


  module.exports = { getAllDepartments, addDepartment,deleteDepartment, getDepartmentById, updateDepartment,addEmployeeToDepartment };



 

