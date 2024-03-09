import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateEmployees from "../create/CreateEmployees";

import { FaTrash, FaEdit } from "react-icons/fa";
import EditEmployee from "../create/EditEmployees";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";
import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  PuffLoader,
} from "react-spinners";

const MySwal = withReactContent(Swal);

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    retrieveEmployees();
  });

  const retrieveEmployees = () => {
    axiosInstance
      .get("/employees")
      .then((res) => {
        if (res.data.success) {
          const formattedEmployees = res.data.existingEmployees.map(
            (employee) => ({
              ...employee,
              date: new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(employee.date)),
            })
          );
          setEmployees(formattedEmployees);
          setFilteredEmployees(formattedEmployees);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Internal Server Error");
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    axiosInstance.delete(`/employee/delete/${id}`).then((res) => {
      setShowDeleteModal(false);
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        text: "Deleted Successfully.",
      });
      retrieveEmployees();
    });
  };

  const handleDeleteIconClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setShowDeleteModal(true);
  };

  const onEdit = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setShowEditModal(true);
  };

  const filterByDateRange = () => {
    const result = employees.filter((employee) => {
      const employeeDate = new Date(employee.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return employeeDate >= startDateObj && employeeDate <= endDateObj;
    });

    setFilteredEmployees(result);
    setLoading(false);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleFilterButtonClick = () => {
    filterByDateRange();
  };

  const generatePDF = () => {
    const content = [
      { text: "EMPLOYEE ON DUTY", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [15, "*", 50, "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Employee On Duty", "Phone"],
            ...filteredEmployees.map((employee, index) => [
              index + 1,
              employee.worker,
              employee.date,
              employee.workerOD,
              employee.phone,
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ];

    const docDefinition = {
      content: content,
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download("EMPLOYEE ON DUTY.pdf"); // This triggers the download
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (loading) {
    // Render loading indicator while fetching data
    return (
      <div
        className="bg-primary"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue",
          height: "100vh",
        }}
      >
        <SyncLoader color="black" />

        {/* <div class="spinner-border spinner-border-lg text-light"></div> */}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <br></br>
        <br></br>
        <div className="employees-record h2 text-center mb-3">
          Employees' Records
        </div>
        <div className="col-lg-3 mt-2 mb-2">
          <button className="btn btn-success mb-3" onClick={toggleModal}>
            Add Worker
          </button>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6 col-6 mt-2 mb-2">
            <label className="fw-bold">FROM:</label>
            <input
              className="form-control"
              type="date"
              placeholder="Start Date"
              name="startDate"
              onChange={handleStartDateChange}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-6 mt-2 mb-2">
            <label className="fw-bold">TO:</label>
            <input
              className="form-control"
              type="date"
              placeholder="End Date"
              name="endDate"
              onChange={handleEndDateChange}
            />
          </div>
          <div className="col-lg-3 mt-4 mb-1">
            <button
              className="btn btn-primary"
              onClick={handleFilterButtonClick}
            >
              Generate
            </button>
            <button className="btn btn-secondary mx-3" onClick={generatePDF}>
              Print PDF
            </button>
          </div>
        </div>
      </div>
      <div className="table-responsive mx-3 mt-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Recording Officer</th>
              <th scope="col">Date</th>
              <th scope="col">Employee On Duty</th>
              <th scope="col">Phone No.</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee._id}>
                <th scope="row">{index + 1}</th>
                <td>{employee.worker}</td>
                <td>{employee.date}</td>
                <td>{employee.workerOD}</td>
                <td>{employee.phone}</td>
                <td>
                  <div className="d-flex flex-row">
                    <button
                      className="btn btn-white"
                      onClick={() => handleDeleteIconClick(employee._id)}
                    >
                      <FaTrash className="text-danger" />
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={() => onEdit(employee._id)}
                    >
                      <FaEdit className="text-secondary" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header
          closeButton
          className="border-0"
          style={{ textAlign: "center" }}
        ></Modal.Header>
        <Modal.Title className="text-center text-danger ">
          <h3>Confirm Delete</h3>
        </Modal.Title>
        <Modal.Body className="border-0 text-center">
          Are you sure you want to delete this product?
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={() => onDelete(selectedEmployeeId)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Render the EditProduct modal */}
      {showEditModal && (
        <EditEmployee
          showModal={showEditModal}
          handleCloseModal={() => setShowEditModal(false)}
          employeeId={selectedEmployeeId}
          retrieveEmployees={retrieveEmployees}
        />
      )}

      <CreateEmployees
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        retrieveEmployees={retrieveEmployees}
      />
    </>
  );
};

export default Employees;
