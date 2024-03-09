const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const birdSchema = new mongoose.Schema({
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

const Bird = mongoose.model("birds", birdSchema);
module.exports = Bird;
