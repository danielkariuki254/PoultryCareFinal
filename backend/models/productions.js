const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productionSchema = new mongoose.Schema({
  worker: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
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

const Production = mongoose.model("Production", productionSchema);
module.exports = Production;
