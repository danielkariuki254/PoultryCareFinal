import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "../routes/AxiosInstance";

const MySwal = withReactContent(Swal);

const CreateSales = ({ showModal, handleCloseModal, retrieveSales }) => {
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({
    worker: "",
    date: "",
    price: "",
    quantity: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "worker") setWorker(value);
    else if (name === "date") setDate(value);
    else if (name === "category") setCategory(value);
    else if (name === "price") setPrice(value);
    else if (name === "quantity") setQuantity(value);
  };

  const validateForm = () => {
    const errors = {
      worker: "",
      date: "",
      price: "",
      quantity: "",
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

    if (!price) {
      errors.price = "Price is required.";
      isValid = false;
    }

    if (!quantity) {
      errors.quantity = "Quantity is required.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
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
        price: price,
        quantity: quantity,
        userId: userId,
      };

      axiosInstance
        .get("/profit", {
          headers: {
            "user-id": userId,
          },
        })
        .then((res) => {
          if (res.data.unsoldEggs >= quantity) {
            axiosInstance
              .post("/sale/save", data)
              .then((res) => {
                if (res.data.success) {
                  setWorker("");
                  setDate("");
                  setCategory("");
                  setPrice("");
                  setQuantity("");
                  MySwal.fire({
                    icon: "success",
                    title: "Sales",
                    text: "Sales Submitted Successfully.",
                  });
                  handleCloseModal();
                  retrieveSales();
                }
              })
              .catch((error) => {
                console.error("Error submitting sales data:", error);
                MySwal.fire({
                  icon: "error",
                  title: "Server Issue",
                  text: "There was a problem submitting the sales data. Please try again later.",
                });
              });
          } else {
            MySwal.fire({
              icon: "error",
              title: "Not Enough Eggs",
              text: "There are not enough eggs for sale.",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching unsold eggs:", error);
          MySwal.fire({
            icon: "error",
            title: "Server Issue",
            text: "There was a problem fetching the data. Please try again later.",
          });
        });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container p-5">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Title className="text-center">Add Sales</Modal.Title>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Recording Officer</label>
              <input
                type="text"
                className={`form-control ${errors.worker && "is-invalid"}`}
                placeholder="Enter Name"
                name="worker"
                value={worker}
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
                value={date}
                max={today}
                onChange={handleInputChange}
              />
              {errors.date && (
                <div className="invalid-feedback">{errors.date}</div>
              )}
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Category"
                name="category"
                value={category}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Rate</label>
              <input
                type="number"
                className={`form-control ${errors.price && "is-invalid"}`}
                placeholder="Enter Price"
                name="price"
                value={price}
                onChange={handleInputChange}
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price}</div>
              )}
            </div>
            <div className="form-group">
              <label>Quantity Sold</label>
              <input
                type="number"
                className={`form-control ${errors.quantity && "is-invalid"}`}
                placeholder="Enter Quantity"
                name="quantity"
                value={quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && (
                <div className="invalid-feedback">{errors.quantity}</div>
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

export default CreateSales;
