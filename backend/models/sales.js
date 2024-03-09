const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saleSchema = new mongoose.Schema({
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
    required: false,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Sale = mongoose.model("Sales", saleSchema);
module.exports = Sale;
