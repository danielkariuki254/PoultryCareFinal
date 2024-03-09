import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "../routes/AxiosInstance";

const MySwal = withReactContent(Swal);

const CreateBirds = ({
  showModal,
  handleCloseModal,
  retrieveProductions,
  productionId,
}) => {
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({
    worker: "",
    date: "",
    quantity: "",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (showModal && productionId) {
      axiosInstance
        .get(`/production/${productionId}`)
        .then((res) => {
          const { worker, date, quantity } = res.data;
          setWorker(worker);
          setDate(date);
          setQuantity(quantity);
        })
        .catch((error) => {
          console.error("Error fetching bird data:", error);
        });
    }
  }, [showModal, productionId]);

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

      const formattedDate = new Date(date).toISOString().split("T")[0];

      const data = {
        worker: worker,
        date: formattedDate,
        quantity: quantity,
        userId: userId,
      };

      axiosInstance

        .put(`/production/update/${productionId}`, data)
        .then((res) => {
          if (res.data.success) {
            setWorker("");
            setDate("");
            setQuantity("");

            MySwal.fire({
              icon: "success",
              title: "Birds",
              text: "Updated Successfully.",
            });
            handleCloseModal();
            retrieveProductions();
          } else {
            MySwal.fire({
              icon: "error",
              title: "Birds",
              text: "Update Failed.",
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

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton className="border-0"></Modal.Header>
      <Modal.Title className="text-center ">Edit Eggs Layed</Modal.Title>
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
        <Button variant="primary" onClick={onSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBirds;
