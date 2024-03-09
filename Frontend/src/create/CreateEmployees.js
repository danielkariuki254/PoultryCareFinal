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

const CreateEmployees = ({
  showModal,
  handleCloseModal,
  retrieveEmployees,
}) => {
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [workerOD, setWorkerOD] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "worker") {
      setWorker(value);
    } else if (name === "date") {
      setDate(value);
    } else if (name === "workerOD") {
      setWorkerOD(value);
    } else if (name === "phone") {
      setPhone(value);
    }
  };

  const onSubmit = (e) => {
    setLoading(false);
    e.preventDefault();

    const errors = {};

    if (!worker) {
      errors.worker = "Recording Officer is required";
    }
    if (!date) {
      errors.date = "Date is required";
    }
    if (!workerOD) {
      errors.workerOD = "Name is required";
    }
    if (!phone) {
      errors.phone = "Phone No. is required";
    }

    if (Object.keys(errors).length === 0) {
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
        workerOD: workerOD,
        phone: phone,
        userId: userId,
      };

      axiosInstance
        .post("/employee/save", data)
        .then((res) => {
          setLoading(false);
          if (res.data.success) {
            setWorker("");
            setDate("");
            setWorkerOD("");
            setPhone("");
            setErrors({});
            MySwal.fire({
              icon: "success",
              title: "Employee",
              text: "Submitted Successfully.",
            });
            handleCloseModal();
            retrieveEmployees();
          } else {
            MySwal.fire({
              icon: "error",
              title: "Employee",
              text: "Submission Failed.",
            });
          }
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
          MySwal.fire({
            icon: "error",
            title: "Server Issue",
            text: "Try again later.",
          });
        });
    } else {
      setErrors(errors);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container p-5">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Title className="text-center">Add Worker</Modal.Title>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Recording Officer</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                name="worker"
                value={worker}
                onChange={handleInputChange}
              />
              {errors.worker && (
                <div className="text-danger">{errors.worker}</div>
              )}
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="Enter Date"
                name="date"
                value={date}
                max={today}
                onChange={handleInputChange}
              />
              {errors.date && <div className="text-danger">{errors.date}</div>}
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                name="workerOD"
                value={workerOD}
                onChange={handleInputChange}
              />
              {errors.workerOD && (
                <div className="text-danger">{errors.workerOD}</div>
              )}
            </div>
            <div className="form-group">
              <label>Phone No.</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Phone No."
                name="phone"
                value={phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <div className="text-danger">{errors.phone}</div>
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

export default CreateEmployees;
