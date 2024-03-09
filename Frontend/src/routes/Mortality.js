import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateMortality from "../create/CreateMortality";
import { FaTrash, FaEdit } from "react-icons/fa";
import EditMortalit from "../create/EditMortality";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";

import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  PuffLoader,
} from "react-spinners";

const MySwal = withReactContent(Swal);

const Mortality = () => {
  const [mortality, setMortality] = useState([]);
  const [filteredMortality, setFilteredMortality] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalMortality, setTotalMortality] = useState(0);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMortalitId, setSelectedMortalitId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveMortality();
  }, []);

  const retrieveMortality = () => {
    axiosInstance
      .get("/mortality")
      .then((res) => {
        if (res.data.success) {
          const formattedMortality = res.data.existingMortality.map(
            (mortalit) => ({
              ...mortalit,
              date: new Intl.DateTimeFormat("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(mortalit.date)),
            })
          );

          setMortality(formattedMortality);
          setFilteredMortality(formattedMortality);
          calculateTotalMortality(formattedMortality);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Internal Server Error");
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    axiosInstance.delete(`/mortalit/delete/${id}`).then((res) => {
      setShowDeleteModal(false);
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        text: "Deleted Successfully.",
      });

      retrieveMortality();
    });
  };

  const handleDeleteIconClick = (mortalitId) => {
    setSelectedMortalitId(mortalitId);
    setShowDeleteModal(true);
  };

  const onEdit = (mortalitId) => {
    setSelectedMortalitId(mortalitId);
    setShowEditModal(true);
  };

  const filterByDateRange = () => {
    const result = mortality.filter((mortalit) => {
      const mortalitDate = new Date(mortalit.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return mortalitDate >= startDateObj && mortalitDate <= endDateObj;
    });

    setFilteredMortality(result);
    calculateTotalMortality(result);
    setLoading(false);
  };

  const calculateTotalMortality = (mortalityList) => {
    const total = mortalityList.reduce(
      (total, mortalit) => total + parseInt(mortalit.quantity),
      0
    );
    setTotalMortality(total);
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
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: " MORTALITY DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Birds Died"],
            ...filteredMortality.map((mortalit, index) => [
              index + 1,
              mortalit.worker,
              mortalit.date,
              mortalit.quantity,
            ]),
            ["Total", "", "", totalMortality],
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

    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download("filtered_birds_died_data.pdf");
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
        <div className="mortality-record h2 text-center mb-3">
          Mortality Records
        </div>
        <div className="col-lg-3 mt-2 mb-2">
          <button className="btn btn-success mb-3" onClick={toggleModal}>
            Add Died Birds
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
              <th scope="col">Birds Died</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredMortality.map((mortalit, index) => (
              <tr key={mortalit._id}>
                <th scope="row">{index + 1}</th>
                <td>{mortalit.worker}</td>
                <td>{mortalit.date}</td>
                <td>{mortalit.quantity}</td>
                <td>
                  <div className="d-flex flex-row">
                    <button
                      className="btn btn-white"
                      onClick={() => handleDeleteIconClick(mortalit._id)}
                    >
                      <FaTrash className="text-danger" />
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={() => onEdit(mortalit._id)}
                    >
                      <FaEdit className="text-secondary" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan="1"></td>
              <td className="fw-bold">Total</td>
              <td></td>
              <td className="fw-bold">{totalMortality}</td>
              <td></td>
            </tr>
          </tfoot>
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
          <Button variant="danger" onClick={() => onDelete(selectedMortalitId)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Render the EditProduct modal */}
      {showEditModal && (
        <EditMortalit
          showModal={showEditModal}
          handleCloseModal={() => setShowEditModal(false)}
          mortalitId={selectedMortalitId}
          retrieveMortality={retrieveMortality}
        />
      )}
      <CreateMortality
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        retrieveMortality={retrieveMortality}
      />
    </>
  );
};

export default Mortality;
