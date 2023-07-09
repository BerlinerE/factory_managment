const express = require('express');
const employeeBLL = require('../BLL/employeesBLL');
const User = require('../models/userModel');
const { authenticateToken, isAuthenticated ,logUserAction, checkUserActions} = require('../middleware/middleRoute');
const shiftBLL = require('../BLL/shiftBLL')
const router = express.Router();

// Apply the middleware to all routes
router.use(authenticateToken, isAuthenticated, checkUserActions);


//Get all Employees
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });
    //Update users logAction file
    await logUserAction(user.id, 'View Employees Page'); 
    const employees = await employeeBLL.getAllEmployees();
    res.json(employees); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});


// Get employee by ID
router.route('/:id').get(async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'View Employee Page'); 
    const { id } = req.params;
    const employee = await employeeBLL.getEmployeeById(id);
    res.json(employee);
  } catch (error) {
    res.status(500)
  }
});

// Add a new Employee
router.route('/').post(async (req, res) => {
  const userId = req.userId; 
  const user = await User.findOne({ webId: userId }); 
  await logUserAction(user.id, 'Add new Employee'); 
  const obj = req.body;
  const result = await employeeBLL.addEmployee(obj);
  return res.status(201).json(result);
});


// Update Employee
router.route('/:id').put(async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'Update Employee'); 
    const { id } = req.params;
    const obj = req.body;
    const result = await employeeBLL.updateEmployee(id, obj);
    res.json(result);
  } catch (error) {
    res.status(500).json('There was an error!');
  }
});

// Delete a employee
router.route('/:id').delete(async (req, res) => {
  try {
    const userId = req.userId; 
    const user = await User.findOne({ webId: userId }); 
    await logUserAction(user.id, 'Delete Employee'); 
    const { id } = req.params;
    const result = await employeeBLL.deleteEmployee(id);
    res.json(result);
  } catch (error) {
    console.log('Error deleting employee:', error);
    res.status(500).json({ error: 'Error deleting employee' });
  }
});


// Get Employee's shifts
router.get('/shifts/:employeeId', async (req, res) => {

  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'Get Employees shifts'); 

    const { employeeId } = req.params;
    const shifts = await shiftBLL.getShiftsByEmployeeId(employeeId);

    res.json(shifts);
  } catch (error) {
    console.log('Error fetching shifts by employee ID:', error);
    res.status(500).json({ error: 'Error fetching shifts by employee ID' });
  }
});



module.exports = router;




