const express = require("express");

const birds = require("../models/birds");

const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/bird/save", (req, res) => {
  const { worker, date, quantity, userId } = req.body;

  // Create a new bird instance with userId
  let newBird = new birds({
    worker: worker,
    date: date,
    quantity: quantity,
    userId: userId,
  });

  // Save the new bird entry
  newBird.save((err) => {
    if (err) {
      console.error("Error saving bird:", err);
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "Bird saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/birds", (req, res) => {
  const userId = req.headers["user-id"];
  // console.log("btokenID:", userId);

  birds.find({ userId: userId }).exec((err, birds) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    // Calculate total quantity
    let totalQuantity = 0;
    birds.forEach((bird) => {
      totalQuantity += parseInt(bird.quantity);
    });

    return res.status(200).json({
      success: true,
      existingBirds: birds,
      totalQuantity: totalQuantity,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/bir/edit/update/:id", (req, res) => {
  birds.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, edit) => {
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

router.delete("/bird/delete/:id", (req, res) => {
  birds.findByIdAndDelete(req.params.id).exec((err, deletedBird) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedBird,
    });
  });
});

// EDIT A BIRD
router.get("/bird/:birdId", async (req, res) => {
  const birdId = req.params.birdId; // Extract productId from request params
  try {
    const bird = await birds.findById(birdId);

    if (!bird) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(bird);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

//FIND AND UPDATE PRODUCT DATA

router.put("/bird/update/:birdId", async (req, res) => {
  try {
    const birdId = req.params.birdId;

    // Retrieve product data from the request body
    const { worker, date, quantity } = req.body;

    // Retrieve existing product data from the database
    const existingBird = await birds.findById(birdId);

    // Create an object to store the updated product data
    const updatedBirdData = {
      worker,
      date,
      quantity,
    };

    // Update the product in the database
    const updatedBird = await birds.findByIdAndUpdate(birdId, updatedBirdData, {
      new: true,
    });

    res.json({ success: true, updatedBird }); // Send the updated product with success status
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Error updating product" }); // Send error response with success status false
  }
});

module.exports = router;
