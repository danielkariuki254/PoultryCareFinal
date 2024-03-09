const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new mongoose.Schema({
  worker: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  workerOD: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
