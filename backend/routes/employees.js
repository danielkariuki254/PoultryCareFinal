const express = require("express");

const employees = require("../models/employees");

const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/employee/save", (req, res) => {
  const { worker, date, workerOD, phone, userId } = req.body;

  let newEmployee = new employees(req.body);

  //save
  newEmployee.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "employees saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/employees", (req, res) => {
  const userId = req.headers["user-id"];
  employees.find({ userId: userId }).exec((err, employees) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: true,
      existingEmployees: employees,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/employee/update/:id", (req, res) => {
  employees.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, employee) => {
      if (err) {
        return res.status(400).json({
          error: "can not update",
        });
      }
      return res.status(200).json({
        success: "Updated Successfully",
      });
    }
  );
});

//DELETE-----------------------------Use delete http request----------------------------------------------------------------------------

router.delete("/employee/delete/:id", (req, res) => {
  employees.findByIdAndDelete(req.params.id).exec((err, deletedEmployee) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedEmployee,
    });
  });
});

// EDIT A EMPLOYEE
router.get("/employee/:employeeId", async (req, res) => {
  const employeeId = req.params.employeeId; // Extract productId from request params
  try {
    const employee = await employees.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

//FIND AND UPDATE PRODUCT DATA

router.put("/employee/update/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Retrieve product data from the request body
    const { worker, date, workerOD, phone } = req.body;

    // Retrieve existing product data from the database
    const existingEmployee = await employees.findById(employeeId);

    // Create an object to store the updated product data
    const updatedEmployeeData = {
      worker,
      date,
      workerOD,
      phone,
    };

    // Update the product in the database
    const updatedEmployee = await employees.findByIdAndUpdate(
      employeeId,
      updatedEmployeeData,
      {
        new: true,
      }
    );

    res.json({ success: true, updatedEmploloyee }); // Send the updated product with success status
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Error updating product" }); // Send error response with success status false
  }
});
module.exports = router;
