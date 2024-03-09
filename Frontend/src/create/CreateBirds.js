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

const CreateBirds = ({ showModal, handleCloseModal, retrieveBirds }) => {
  // const [showModal, setShowModal] = useState(false);
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({
    worker: "",
    date: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "worker") {
      setWorker(value);
    } else if (name === "date") {
      setDate(value);
    } else if (name === "quantity") {
      setQuantity(value);
    }
  };

  const validateForm = () => {
    const newErrors = {
      worker: "",
      date: "",
      quantity: "",
    };
    let isValid = true;

    if (!worker) {
      newErrors.worker = "Worker name is required.";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "Date is required.";
      isValid = false;
    }

    if (!quantity) {
      newErrors.quantity = "Quantity is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = (e) => {
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

      const formattedDate = new Date(date).toISOString().split("T")[0];

      const data = {
        worker: worker,
        date: formattedDate,
        quantity: quantity,
        userId: userId,
      };

      axiosInstance
        .post("/bird/save", data)
        .then((res) => {
          setLoading(false);
          if (res.data.success) {
            setWorker("");
            setDate("");
            setQuantity("");

            // Alert user of successful submission
            MySwal.fire({
              icon: "success",
              title: "Birds",
              text: "Submitted Successfully.",
            });
            handleCloseModal();
            retrieveBirds();
          } else {
            // Alert user of unsuccessful submission
            MySwal.fire({
              icon: "error",
              title: "Birds",
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
            text: "Try again later",
          });
        });
    }
  };

  return (
    <div className="container p-5">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Title className="text-center">Add Birds</Modal.Title>
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
              <label>Birds Bought</label>
              <input
                type="number"
                className={`form-control ${errors.quantity && "is-invalid"}`}
                placeholder="Enter Birds Bought"
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

export default CreateBirds;
