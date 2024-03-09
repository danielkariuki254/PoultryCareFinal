const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new mongoose.Schema({
  worker: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },

  quantity: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Purchase = mongoose.model("Purchases", purchaseSchema);
module.exports = Purchase;
