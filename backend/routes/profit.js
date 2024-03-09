const express = require("express");
const mongoose = require("mongoose");
const Sale = require("../models/sales");
const Purchase = require("../models/purchases");
const Production = require("../models/productions");
const router = express.Router();

// Define a route to aggregate and return the total quantity for the current year
router.get("/profit", async (req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();
    const userId = req.headers["user-id"];

    // Aggregate the quantity and sales amount from the Sale collection for the current year
    const saleResult = await Sale.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalSaleAmnt: { $sum: { $multiply: ["$quantity", "$price"] } },
          totalSaleQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const productionResult = await Production.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          // totalSaleAmnt: { $sum: { $multiply: ["$quantity", "$price"] } },
          totalProductionQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Aggregate the quantity from the Purchase collection for the current year
    const purchaseResult = await Purchase.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPurchaseQuantity: { $sum: "$amount" },
        },
      },
    ]);

    // Calculate the total profit by subtracting the total purchase quantity from the total sale quantity
    const totalProfit =
      (saleResult[0]?.totalSaleAmnt || 0) -
      (purchaseResult[0]?.totalPurchaseQuantity || 0);

    const unsoldEggs =
      (productionResult[0]?.totalProductionQuantity || 0) -
      (saleResult[0]?.totalSaleQuantity || 0);

    // Return the total profit, total sale quantity, and total sale amount for the current year as JSON
    res.json({
      totalProfit,

      totalSaleQuantity: saleResult[0]?.totalSaleQuantity || 0,
      totalSaleAmnt: saleResult[0]?.totalSaleAmnt || 0,
      totalPurchaseQuantity: purchaseResult[0]?.totalPurchaseQuantity || 0,
      totalProductionQuantity:
        productionResult[0]?.totalProductionQuantity || 0,
      unsoldEggs,
    });
  } catch (error) {
    console.error("Error aggregating data:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
