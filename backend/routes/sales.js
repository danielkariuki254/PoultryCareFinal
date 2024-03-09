const express = require("express");

const sales = require("../models/sales");

const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/sale/save", (req, res) => {
  //create variable and instantiate
  let newSale = new sales(req.body);

  //save
  newSale.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "sales saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/sales", (req, res) => {
  const userId = req.headers["user-id"];

  sales.find({ userId: userId }).exec((err, sales) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: true,
      existingSales: sales,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/sale/update/:id", (req, res) => {
  sales.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, sale) => {
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

router.delete("/sale/delete/:id", (req, res) => {
  sales.findByIdAndDelete(req.params.id).exec((err, deletedSale) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedSale,
    });
  });
});

// EDIT A BIRD
router.get("/sale/:saleId", async (req, res) => {
  const saleId = req.params.saleId; // Extract productId from request params
  try {
    const sale = await sales.findById(saleId);

    if (!sale) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(sale);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

//FIND AND UPDATE PRODUCT DATA

router.put("/sale/update/:saleId", async (req, res) => {
  try {
    const saleId = req.params.saleId;

    // Retrieve product data from the request body
    const { worker, date, category, price, quantity } = req.body;

    // Create an object to store the updated product data
    const updatedSaleData = {
      worker,
      date,
      category,
      price,
      quantity,
    };

    // Update the product in the database
    const updatedSale = await sales.findByIdAndUpdate(saleId, updatedSaleData, {
      new: true,
    });

    res.json({ success: true, updatedSale }); // Send the updated product with success status
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Error updating product" }); // Send error response with success status false
  }
});
module.exports = router;
