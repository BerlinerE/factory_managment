const express = require('express');
const shiftBLL = require('../BLL/shiftBLL');
const User = require('../models/userModel');
const { authenticateToken, isAuthenticated ,logUserAction,checkUserActions} = require('../middleware/middleRoute');
const router = express.Router();
router.use(authenticateToken, isAuthenticated, checkUserActions);


// Get all Shifts
router.route('/').get(async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findOne({ webId: userId });
     await logUserAction(user.id, 'View Shifts Page'); 
     const shifts = await shiftBLL.getAllShifts();
     res.json(shifts);
 
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch shifts' });
   }
});


//Add new shift
router.route('/').post(async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findOne({ webId: userId });
     await logUserAction(user.id, 'Add new shift'); 
     const obj = req.body;
     console.log("obj",obj)
     const result = await shiftBLL.addShift(obj);
     res.status(201).json(result);
 
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch shifts' });
   }

});


// Update shift
router.route('/:id').put(async (req, res) => {
  try {
    const userId = req.userId; // the id in the session request
    const user = await User.findOne({ webId: userId }); // Fetch the user from the database based on the webId
    await logUserAction(user.id, 'Update shift'); 
    const { id } = req.params;
    const obj = req.body;
    const result = await shiftBLL.updateShift(id, obj);
    res.json(result);
  } catch (error) {
    res.status(500).json('There was an error!');
  }
});

// Allocating an employee to a shift
router.route('/:shiftId/allocate').post(async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });
    await logUserAction(user.id, 'Allocating an employee to a shift'); 
    const shiftId = req.params.shiftId;
    const employeeId = req.body.employeeId;

    const result = await shiftBLL.allocateEmployeeToShift(shiftId, employeeId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to allocate employee to shift' });
  }
});



module.exports = router;






