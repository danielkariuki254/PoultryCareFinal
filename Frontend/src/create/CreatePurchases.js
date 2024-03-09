import React, { useState } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";

const MySwal = withReactContent(Swal);

const CreatePurchases = ({
  showModal,
  handleCloseModal,
  retrievePurchases,
}) => {
  const [state, setState] = useState({
    worker: "",
    date: "",
    category: "",
    quantity: "",
    amount: "",
    errors: {
      worker: "",
      date: "",
      category: "",
      quantity: "",
      amount: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { worker, date, category, quantity, amount } = state;
    const errors = {
      worker: "",
      date: "",
      category: "",
      quantity: "",
      amount: "",
    };
    let isValid = true;

    if (!worker) {
      errors.worker = "Worker name is required.";
      isValid = false;
    }

    if (!date) {
      errors.date = "Date is required.";
      isValid = false;
    }

    if (!category) {
      errors.category = "Category is required.";
      isValid = false;
    }

    if (!quantity) {
      errors.quantity = "Quantity is required.";
      isValid = false;
    }

    if (!amount) {
      errors.amount = "Amount is required.";
      isValid = false;
    }

    setState({ ...state, errors });
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { worker, date, category, quantity, amount } = state;

      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("Token not found in session storage.");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      if (!decodedToken || !decodedToken.userId) {
        console.error("User id not found in token.");
        return;
      }

      const userId = decodedToken.userId;

      const data = {
        worker: worker,
        date: date,
        category: category,
        quantity: quantity,
        amount: amount,
        userId: userId, // Include the userId in the data
      };

      axiosInstance
        .post("/purchase/save", data)
        .then((res) => {
          if (res.data.success) {
            setState({
              ...state,
              worker: "",
              date: "",
              category: "",
              quantity: "",
              amount: "",
            });

            // Alert user of successful submission
            MySwal.fire({
              icon: "success",
              title: "Purchase",
              text: "Submitted Successfully.",
            });
            retrievePurchases();
            handleCloseModal();
          } else {
            // Alert user of unsuccessful submission
            MySwal.fire({
              icon: "error",
              title: "Purchase",
              text: "Submission Failed.",
            });
          }
        })
        .catch((error) => {
          // Handle error
          console.error("Error submitting data:", error);
          // Alert user of unsuccessful submission
          MySwal.fire({
            icon: "error",
            title: "Server Issue",
            text: "Try again later.",
          });
        });
    }
  };

  const { errors } = state;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container p-5">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Title className="text-center">Add Expenses Accrued</Modal.Title>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Recording Officer</label>
              <input
                type="text"
                className={`form-control ${errors.worker && "is-invalid"}`}
                placeholder="Enter Name"
                name="worker"
                value={state.worker}
                onChange={handleInputChange}
              />
              {errors.worker && (
                <div className="invalid-feedback">{errors.worker}</div>
              )}
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className={`form-control ${errors.date && "is-invalid"}`}
                name="date"
                value={state.date}
                max={today}
                onChange={handleInputChange}
              />
              {errors.date && (
                <div className="invalid-feedback">{errors.date}</div>
              )}
            </div>
            <div className="form-group">
              <label>Category of Expense</label>
              <input
                type="text"
                className={`form-control ${errors.category && "is-invalid"}`}
                placeholder="Enter category"
                name="category"
                value={state.category}
                onChange={handleInputChange}
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="text"
                className={`form-control ${errors.quantity && "is-invalid"}`}
                placeholder="Enter quantity"
                name="quantity"
                value={state.quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && (
                <div className="invalid-feedback">{errors.quantity}</div>
              )}
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                className={`form-control ${errors.amount && "is-invalid"}`}
                placeholder="Enter amount"
                name="amount"
                value={state.amount}
                onChange={handleInputChange}
              />
              {errors.amount && (
                <div className="invalid-feedback">{errors.amount}</div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreatePurchases;
