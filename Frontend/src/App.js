import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Birds from "./routes/Birds";
import Home from "./routes/Home";
import Productions from "./routes/Productions";
import Sales from "./routes/Sales";
import Employees from "./routes/Employees";
import Purchases from "./routes/Purchases";
import Mortality from "./routes/Mortality";

import CreateSales from "./create/CreateSales";
import CreateBirds from "./create/CreateBirds";
import CreateProductions from "./create/CreateProductions";
import CreateEmployees from "./create/CreateEmployees";
import CreatePurchases from "./create/CreatePurchases";
import CreateMortality from "./create/CreateMortality";

import EditBirds from "./create/EditBirds";
import EditEmployees from "./create/EditEmployees";
import EditMortality from "./create/EditMortality";
import EditPurchases from "./create/EditPurchases";
import EditSales from "./create/EditSales";
import AxiosInstance from "./routes/AxiosInstance";

import Login from "./auth/Login";
import SignUp from "./auth/SignUp";

function App() {
  const [isUserSignedIn] = useState(!!sessionStorage.getItem("token"));

  // setIsUserSignedIn(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {isUserSignedIn ? (
          <>
            <Route path="/birds" element={<Birds />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/mortality" element={<Mortality />} />
            <Route path="/productions" element={<Productions />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/createbirds" element={<CreateBirds />} />
            <Route path="/createemployees" element={<CreateEmployees />} />
            <Route path="/createmortality" element={<CreateMortality />} />
            <Route path="/createproductions" element={<CreateProductions />} />
            <Route path="/createpurchases" element={<CreatePurchases />} />
            <Route path="/createsales" element={<CreateSales />} />

            <Route path="/editbird/:birdId" element={<EditBirds />} />
            <Route
              path="/editemployee/:employeeId"
              element={<EditEmployees />}
            />
            <Route
              path="/editmortlit/:mortalitId"
              element={<EditMortality />}
            />
            <Route
              path="/editPurchase/:purchaseId"
              element={<EditPurchases />}
            />
            <Route path="/editSale/:saleId" element={<EditSales />} />
            <Route path="/home" element={<Home />} />
            {/* Redirect any other route to home */}
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/axiosInstance" element={<AxiosInstance />} />
          </>
        ) : (
          // Redirect to login if user is not signed in
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
