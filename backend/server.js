const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();
require("dotenv").config();

const birdRoutes = require("./routes/birds");
const saleRoutes = require("./routes/sales");
const productionRoutes = require("./routes/productions");
const employeeRoutes = require("./routes/employees");
const purchaseRoutes = require("./routes/purchases");
const mortalitRoutes = require("./routes/mortality");
const mrateRoutes = require("./routes/mortalityRate");
const profitRoutes = require("./routes/profit");
const salesgraphRoutes = require("./routes/salesgraph");

const userRoutes = require("./routes/user");

//app middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(birdRoutes);
app.use(saleRoutes);
app.use(productionRoutes);
app.use(employeeRoutes);
app.use(purchaseRoutes);
app.use(mortalitRoutes);
app.use(mrateRoutes);
app.use(profitRoutes);
app.use(salesgraphRoutes);
app.use(userRoutes);

//declare a port
const PORT = process.env.PORT || 3000;

//listen the application
app.listen(PORT, () => {
  console.log("Server is up and running on port number :", PORT);
});

//create db connection

const DB_URL = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb connection success!");
  })
  .catch((err) => console.log("unsuccess!", err));
