
const jsonfile = require("jsonfile");

// Read from a JSON file 
const readJsonFile = async (filePath) => {
  try {
    const data = await jsonfile.readFile(filePath);
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
};

// Write to a JSON file 
const writeJsonFile = async (filePath, data) => {
  try {
    await jsonfile.writeFile(filePath, data, { spaces: 2 });
    console.log("Data written successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
    throw err;
  }
};

//LOG Action
const logAction = async (actionData, filePath) => {
    try {
      const existingData = await readJsonFile(filePath);
      // Ensure existingData is an array
      const dataArray = Array.isArray(existingData) ? existingData : [];
  
      // Add the new action to the existing data array
      dataArray.push(actionData);
  
      await writeJsonFile(filePath, dataArray);
      console.log("Action logged successfully!");
    } catch (err) {
      console.error("Error logging action:", err);
      throw err;
    }
  };
  
  module.exports = { readJsonFile, writeJsonFile, logAction };

