import React, { useState } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";
const MySwal = withReactContent(Swal);

const CreateProduction = ({
  showModal,
  handleCloseModal,
  retrieveProductions,
}) => {
  const [state, setState] = useState({
    worker: "",
    date: "",
    quantity: "",
    errors: {
      worker: "",
      date: "",
      quantity: "",
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
    const { worker, date, quantity } = state;
    const errors = {
      worker: "",
      date: "",
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

    if (!quantity) {
      errors.quantity = "Quantity is required.";
      isValid = false;
    }

    setState({
      ...state,
      errors: errors,
    });
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { worker, date, quantity } = state;

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
        quantity: quantity,
        userId: userId,
      };

      axiosInstance
        .post("/production/save", data)
        .then((res) => {
          if (res.data.success) {
            setState({
              ...state,
              worker: "",
              date: "",
              quantity: "",
            });

            MySwal.fire({
              icon: "success",
              title: "Production",
              text: "Submitted Successfully.",
            });
            retrieveProductions();
            handleCloseModal();
          } else {
            MySwal.fire({
              icon: "error",
              title: "Production",
              text: "Submission Failed.",
            });
          }
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
          MySwal.fire({
            icon: "error",
            title: "Server Issue",
            text: "Try again later",
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
        <Modal.Title className="text-center">Add Eggs Produced</Modal.Title>
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
              <label>Eggs Layed</label>
              <input
                type="number"
                className={`form-control ${errors.quantity && "is-invalid"}`}
                placeholder="Enter Eggs Layed"
                name="quantity"
                value={state.quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && (
                <div className="invalid-feedback">{errors.quantity}</div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-between ">
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

export default CreateProduction;
