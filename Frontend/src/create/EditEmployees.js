import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "../routes/AxiosInstance";

const MySwal = withReactContent(Swal);

const EditEmployees = ({
  showModal,
  handleCloseModal,
  retrieveEmployees,
  employeeId,
}) => {
  const [worker, setWorker] = useState("");
  const [date, setDate] = useState("");
  const [workerOD, setWorkerOD] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (showModal && employeeId) {
      axiosInstance
        .get(`/employee/${employeeId}`)
        .then((res) => {
          const { worker, date, workerOD, phone } = res.data;
          setWorker(worker);
          setDate(date);
          setWorkerOD(workerOD);
          setPhone(phone);
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
        });
    }
  }, [showModal, employeeId]);

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

  const validateForm = () => {
    const newErrors = {
      worker: "",
      date: "",
      workerOD: "",
      phone: "",
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
    if (!workerOD) {
      newErrors.workerOD = "Worker on duty is required.";
      isValid = false;
    }

    if (!phone) {
      newErrors.phone = "Quantity is required.";
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
        workerOD: workerOD,
        phone: phone,
        userId: userId,
      };

      axiosInstance
        .put(`/employee/update/${employeeId}`, data)
        .then((res) => {
          if (res.data.success) {
            setWorker("");
            setDate("");
            setWorkerOD("");
            setPhone("");

            MySwal.fire({
              icon: "success",
              title: "Birds",
              text: "Updated Successfully.",
            });
            handleCloseModal();
            retrieveEmployees();
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
      <Modal.Title className="text-center ">Edit Worker</Modal.Title>
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
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
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

export default EditEmployees;
