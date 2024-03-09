const express = require("express");
const mongoose = require("mongoose");
const Sale = require("../models/sales");
const router = express.Router();

// Define an array of static months
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

router.get("/calculateTotalSalesByMonth", async (req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();
    const userId = req.headers["user-id"];
    // console.log("chartID:", userId);

    // Fetch the total sales data from the database
    const salesData = await Sale.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId), // Filter by userId
          $expr: {
            $eq: [{ $year: "$date" }, currentYear],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId", // Group by userId
            month: { $month: "$date" }, // Group by the numeric month
          },
          totalSales: {
            $sum: {
              $multiply: ["$price", "$quantity"],
            },
          },
        },
      },
      {
        $sort: { "_id.month": 1 }, // Sort by the numeric month in ascending order
      },
    ]);

    // Merge static month names with total sales data
    const result = months.map((month, index) => {
      const sales = salesData.find((item) => item._id.month === index + 1);
      return {
        month,
        totalSales: sales ? sales.totalSales : null,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
