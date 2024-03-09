const express = require("express");

const productions = require("../models/productions");

const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/production/save", (req, res) => {
  // const { worker, date, quantity, userId } = req.body;
  //create variable and instantiate
  let newProduction = new productions(req.body);

  //save
  newProduction.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "production saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/productions", (req, res) => {
  const userId = req.headers["user-id"];

  productions.find({ userId: userId }).exec((err, productions) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: true,
      existingProductions: productions,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/production/update/:id", (req, res) => {
  productions.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, production) => {
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

router.delete("/production/delete/:id", (req, res) => {
  productions
    .findByIdAndDelete(req.params.id)
    .exec((err, deletedProduction) => {
      if (err)
        return res.status(400).json({
          message: "Deleted unsuccussfull",
          err,
        });

      return res.json({
        message: "Deleted succussfully",
        deletedProduction,
      });
    });
});

// EDIT A RODUCTION
router.get("/production/:productionId", async (req, res) => {
  const productionId = req.params.productionId; // Extract productId from request params
  try {
    const production = await productions.findById(productionId);

    if (!production) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(production);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

//FIND AND UPDATE PRODUCT DATA

router.put("/production/update/:productionId", async (req, res) => {
  try {
    const productionId = req.params.productionId;

    // Retrieve product data from the request body
    const { worker, date, quantity } = req.body;

    // Retrieve existing product data from the database
    const existingProduction = await productions.findById(productionId);

    // Create an object to store the updated product data
    const updatedProductionData = {
      worker,
      date,
      quantity,
    };

    // Update the product in the database
    const updatedProduction = await productions.findByIdAndUpdate(
      productionId,
      updatedProductionData,
      {
        new: true,
      }
    );

    res.json({ success: true, updatedProduction }); // Send the updated product with success status
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Error updating product" }); // Send error response with success status false
  }
});

module.exports = router;
