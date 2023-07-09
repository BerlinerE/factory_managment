const Shift = require('../models/shiftModel');
const Employee = require('../models/employeeModel');


// Get All Shifts
const getAllShifts = async () => {
    return await Shift.find().populate('employees');
}
// Add a new shift
/*
const addShift = async (shiftData) => {
    const shift = new Shift(shiftData);
    await shift.save();
    return 'Shift created successfully!';
};
*/
const addShift = async (shiftData) => {
  try {
    const { date, startingHour, endingHour, employees } = shiftData;

    // Create a new shift
    const shift = new Shift({ date, startingHour, endingHour ,employees});
    await shift.save();

    // Update each employee with the new shift ID
    const promises = employees.map(async (employeeId) => {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error(`Employee not found for ID: ${employeeId}`);
      }

      // Add the new shift ID to the employee's shifts array
      employee.shifts.push(shift._id);
      await employee.save();
    });

    //await Promise.all(promises);

    // Return the created shift
    return 'Shift created successfully!';
  } catch (error) {
    throw new Error('Failed to add shift');
  }
};


// Update a shift
const updateShift = async (shiftId, shiftData) => {
    await Shift.findByIdAndUpdate(shiftId, shiftData);
    return 'Shift updated successfully!';
};

// Function to allocate an employee to a shift
async function allocateEmployeeToShift(shiftId, employeeId) {
  try {
    const shift = await Shift.findByIdAndUpdate(shiftId, { $push: { employees: employeeId } });
    if (!shift) {
      throw new Error('Shift not found');
    }
    return { success: true, message: 'Employee allocated to shift successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to allocate employee to shift');
  }
}

const getShiftsByEmployeeId = async (employeeId) => {
  try {
    console.log(employeeId)
    const employee = await Employee.findById(employeeId).populate('shifts');
    console.log(employee.firstName,employee)
    if (!employee) {
      throw new Error('Employee not found');
    }
    console.log('Shifts1:', employee.shifts);
    return employee.shifts
  } catch (error) {
    throw new Error('Failed to fetch shifts by employee ID');
  }
};

module.exports = {
  getAllShifts,
  addShift,
  updateShift,
  allocateEmployeeToShift,
  getShiftsByEmployeeId,
};


 
  
  
   