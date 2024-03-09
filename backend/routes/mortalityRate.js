const express = require("express");
const mongoose = require("mongoose");
const Bird = require("../models/birds");
const Mortality = require("../models/mortality");

const router = express.Router();

router.get("/mortalityRate", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const userId = req.headers["user-id"];

    // Aggregate the quantity from the Birds collection for the current year and the logged-in user
    const birdResult = await Bird.aggregate([
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
          totalBirdQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Aggregate the quantity from the Mortalities collection for the current year and the logged-in user
    const mortalityResult = await Mortality.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId), // Filter by userId
          date: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalMortalityQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Calculate the total quantities and round them to the nearest whole numbers
    const totalBirdQuantity =
      birdResult.length > 0 ? birdResult[0].totalBirdQuantity : 0;
    const totalMortalityQuantity =
      mortalityResult.length > 0
        ? mortalityResult[0].totalMortalityQuantity
        : 0;

    // Calculate the remainingBirds by subtracting totalMortalityQuantity from totalBirdQuantity
    const remainingBirds = totalBirdQuantity - totalMortalityQuantity;

    // Calculate the mortality rate
    const mortalityRate = Math.round(
      (totalMortalityQuantity / totalBirdQuantity) * 100
    );

    // Return the total quantities, the remainingBirds, and the mortality rate as JSON
    res.json({
      totalBirdQuantity,
      totalMortalityQuantity,
      remainingBirds,
      mortalityRate,
    });
  } catch (error) {
    console.error("Error aggregating data:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
