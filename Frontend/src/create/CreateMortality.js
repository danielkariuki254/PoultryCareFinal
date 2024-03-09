import React, { useState } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";

import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  ClipLoader,
  PuffLoader,
} from "react-spinners";

const MySwal = withReactContent(Swal);

const CreateMortality = ({
  showModal,
  handleCloseModal,
  retrieveMortality,
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
  const [loading, setLoading] = useState(false);

  const { worker, date, quantity, errors } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const validateForm = () => {
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

    setState({ ...state, errors });
    return isValid;
  };

  const onSubmit = (e) => {
    setLoading(false);
    e.preventDefault();

    if (validateForm()) {
      setLoading(false);
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("Token not found in session storage.");
        setLoading(false);
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      if (!decodedToken || !decodedToken.userId) {
        console.error("User id not found in token.");
        setLoading(false);
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
        .post("/mortalit/save", data)
        .then((res) => {
          setLoading(false);
          if (res.data.success) {
            setState({
              worker: "",
              date: "",
              quantity: "",
              errors: {
                worker: "",
                date: "",
                quantity: "",
              },
            });

            MySwal.fire({
              icon: "success",
              title: "Mortality",
              text: "Submitted Successfully.",
            });
            retrieveMortality();
            handleCloseModal();
          } else {
            MySwal.fire({
              icon: "error",
              title: "Mortality",
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container p-5">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Title className="text-center">Add Died Birds</Modal.Title>
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
              <label>Birds Died</label>
              <input
                type="number"
                className={`form-control ${errors.quantity && "is-invalid"}`}
                placeholder="Enter number"
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
        <Modal.Footer className="bborder-0 d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={loading}
            style={{ width: "100px", height: "40px" }}
          >
            {loading ? <ClipLoader color="black" size={15} /> : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateMortality;
