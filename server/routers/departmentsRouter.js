const express = require('express');
const departmentsBLL = require('../BLL/departmentsBLL');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const { authenticateToken, isAuthenticated,logUserAction , checkUserActions} = require('../middleware/middleRoute');
const Employee = require("../models/employeeModel");
const router = express.Router();

router.use(authenticateToken, isAuthenticated, checkUserActions);
//Get all Department
router.route('/').get(async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'View Department Page'); 
    const departments = await departmentsBLL.getAllDepartments();
    res.json(departments);

    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch departments' });
    }

});

// Get departments with populated employees
router.route('/populated').get( async (req, res) => {
  try {
    //const userId = req.userId
   // const user = await User.findOne({ webId: userId });
    const departments = await Department.find().populate('employees');
    res.json(departments);
    console.log(departments)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve department data with populated employees' });
  }
});


// Add a new Department
router.route('/').post(async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'Add a new Department'); 
    const obj = req.body;
    const result = await departmentsBLL.addDepartment(obj);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});
  
// GET Department ID
router.route('/:id').get(async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'GET Department'); 
    const { id } = req.params; // Retrieve the department ID from req.params
    const dep = await departmentsBLL.getDepartmentById(id);
    res.json(dep);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

  
// Delete Department
router.route('/:id').delete(async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findOne({ webId: userId });
     await logUserAction(user.id, 'Delete Department'); 
     const { id } = req.params;
     const result = await departmentsBLL.deleteDepartment(id);
     res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});


// Update Department
router.route('/:id').put( async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'Update Department'); 
    const { id } = req.params; 
    const updatedDepartment = req.body; 
    const result = await departmentsBLL.updateDepartment(id, updatedDepartment);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

// Add an employee to a department
router.route('/:id/addEmployee').put(async (req, res) => {
  const userId = req.userId;
  const user = await User.findOne({ webId: userId });
  try {
    const departmentId = req.params.id;
    const employeeId = req.body.employeeId;

    // Find the department by ID
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if the employee is already in a department
    if (employee.departmentID) {
      const previousDepartment = await Department.findById(employee.departmentID);
      if (previousDepartment) {
        // Remove the employee ID from the previous department if it exists
        const index = previousDepartment.employees.indexOf(employeeId);
        if (index !== -1) {
          previousDepartment.employees.splice(index, 1);
          await previousDepartment.save();
        }
      }
    }

    // Check if the employee's department ID is different from the new department ID
    if (employee.departmentID.toString() !== departmentId) {
      // Update the employee's department ID
      employee.departmentID = departmentId;
      await employee.save();
    }

    // Add the employee to the department
    department.employees.push(employeeId);
    await department.save();

    await logUserAction(user.id, 'Add an employee to a department');
    
    res.json({ message: "Employee added to the department successfully" });
  } catch (error) {
    console.error("Error adding employee to department:", error);
    res.status(500).json({ message: "Failed to add employee to department" });
  }
});


module.exports = router;



