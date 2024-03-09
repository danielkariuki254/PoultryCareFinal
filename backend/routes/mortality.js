const express = require("express");

const Mortality = require("../models/mortality");

const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/mortalit/save", (req, res) => {
  const { worker, date, quantity, userId } = req.body;

  let newMortalit = new Mortality(req.body);

  //save
  newMortalit.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "mortality saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/mortality", (req, res) => {
  const userId = req.headers["user-id"];

  Mortality.find({ userId: userId }).exec((err, mortality) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    // Calculate total quantity
    let totalMortalityQuantity = 0;
    mortality.forEach((mortalit) => {
      totalMortalityQuantity += parseInt(mortalit.quantity); // Parse quantity as integer
    });

    return res.status(200).json({
      success: true,
      existingMortality: mortality,
      totalMortalityQuantity: totalMortalityQuantity,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/mortalit/update/:id", (req, res) => {
  Mortality.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, mortalit) => {
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

router.delete("/mortalit/delete/:id", (req, res) => {
  Mortality.findByIdAndDelete(req.params.id).exec((err, deletedMortalit) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedMortalit,
    });
  });
});

// EDIT A MORTALITY
router.get("/mortalit/:mortalitId", async (req, res) => {
  const mortalityId = req.params.mortalitId; // Extract productId from request params
  // console.log("mortalityId", mortalityId);
  try {
    const mortality = await Mortality.findById(mortalityId);

    if (!mortality) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(mortality);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

//FIND AND UPDATE PRODUCT DATA

router.put("/mortalit/update/:mortalitId", async (req, res) => {
  try {
    const mortalityId = req.params.mortalitId;

    // Retrieve product data from the request body
    const { worker, date, quantity } = req.body;

    // Retrieve existing product data from the database
    const existingMortality = await Mortality.findById(mortalityId);

    // Create an object to store the updated product data
    const updatedMortalityData = {
      worker,
      date,
      quantity,
    };

    // Update the product in the database
    const updatedMortality = await Mortality.findByIdAndUpdate(
      mortalityId,
      updatedMortalityData,
      {
        new: true,
      }
    );

    res.json({ success: true, updatedMortality }); // Send the updated product with success status
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Error updating product" }); // Send error response with success status false
  }
});
module.exports = router;
