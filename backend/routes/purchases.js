const express = require("express");

const purchases = require("../models/purchases");

const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/purchase/save", (req, res) => {
  //create variable and instantiate
  let newPurchase = new purchases(req.body);

  //save
  newPurchase.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "purchases saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/purchases", (req, res) => {
  const userId = req.headers["user-id"];

  purchases.find({ userId: userId }).exec((err, purchases) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    let totalPurchasesQuantity = 0;
    purchases.forEach((purchase) => {
      totalPurchasesQuantity += parseInt(purchase.amount); // Parse quantity as integer
    });

    return res.status(200).json({
      success: true,
      existingPurchases: purchases,
      totalPurchasesQuantity: totalPurchasesQuantity,
    });
  });
});
//DELETE-----------------------------Use delete http request----------------------------------------------------------------------------

router.delete("/purchase/delete/:id", (req, res) => {
  purchases.findByIdAndDelete(req.params.id).exec((err, deletedPurchase) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedPurchase,
    });
  });
});

// EDIT A PURCHASE
router.get("/purchase/:purchaseId", async (req, res) => {
  const purchaseId = req.params.purchaseId; // Extract productId from request params
  try {
    const purchase = await purchases.findById(purchaseId);

    if (!purchase) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(purchase);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

//FIND AND UPDATE PRODUCT DATA

router.put("/purchase/update/:purchaseId", async (req, res) => {
  try {
    const purchaseId = req.params.purchaseId;

    // Retrieve product data from the request body
    const { worker, date, category, quantity, amount } = req.body;

    // Create an object to store the updated product data
    const updatedPurchaseData = {
      worker,
      date,
      category,
      quantity,
      amount,
    };

    // Update the product in the database
    const updatedPurchase = await purchases.findByIdAndUpdate(
      purchaseId,
      updatedPurchaseData,
      {
        new: true,
      }
    );

    res.json({ success: true, updatedPurchase }); // Send the updated product with success status
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Error updating product" }); // Send error response with success status false
  }
});

module.exports = router;
