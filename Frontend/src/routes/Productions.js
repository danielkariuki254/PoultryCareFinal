import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateProductions from "../create/CreateProductions";
import { FaTrash, FaEdit } from "react-icons/fa";
import EditProduction from "../create/EditProdctions";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";
import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  PuffLoader,
} from "react-spinners";

const MySwal = withReactContent(Swal);

const Productions = () => {
  const [productions, setProductions] = useState([]);
  const [filteredProductions, setFilteredProductions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalProductions, setTotalProductions] = useState(0);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveProductions();
  }, []);

  const retrieveProductions = () => {
    axiosInstance
      .get("/productions")
      .then((res) => {
        if (res.data.success) {
          const productions = res.data.existingProductions.map((production) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(production.date));
            return { ...production, date: formattedDate };
          });

          setProductions(productions);
          setFilteredProductions(productions);
          calculateTotalProductions(productions);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Internal Server Error");
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    axiosInstance.delete(`/production/delete/${id}`).then((res) => {
      setShowDeleteModal(false);

      MySwal.fire({
        icon: "success",
        title: "Deleted",
        text: "Deleted Successfully.",
      });
      retrieveProductions();
    });
  };

  const handleDeleteIconClick = (productionId) => {
    setSelectedProductionId(productionId);
    setShowDeleteModal(true);
  };

  const onEdit = (productionId) => {
    setSelectedProductionId(productionId);
    setShowEditModal(true);
  };

  const filterByDateRange = () => {
    const result = productions.filter((production) => {
      const productionDate = new Date(production.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return productionDate >= startDateObj && productionDate <= endDateObj;
    });

    setFilteredProductions(result);
    calculateTotalProductions(result);
    setLoading(false);
  };

  const calculateTotalProductions = (productions) => {
    const totalProductions = productions.reduce(
      (total, production) => total + parseInt(production.quantity),
      0
    );
    setTotalProductions(totalProductions);
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
      { text: " Productions Data", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Productions Bought"],
            ...filteredProductions.map((production, index) => [
              index + 1,
              production.worker,
              production.date,
              production.quantity,
            ]),
            ["Total", "", "", totalProductions],
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
    pdfDoc.download("filtered_production_data.pdf");
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
        <div className="productions-record h2 text-center mb-3">
          Productions' Records
        </div>
        <div className="col-lg-3 mt-2 mb-2">
          <button className="btn btn-success mb-3" onClick={toggleModal}>
            Add Eggs Layed
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

          <div className="col-lg-3  mt-4 mb-1">
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
              <th scope="col">Eggs Produced</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProductions.map((production, index) => (
              <tr key={production._id}>
                <th scope="row">{index + 1}</th>
                <td>{production.worker}</td>
                <td>{production.date}</td>
                <td>{production.quantity}</td>
                <td>
                  <div className="d-flex flex-row">
                    <button
                      className="btn btn-white"
                      onClick={() => handleDeleteIconClick(production._id)}
                    >
                      <FaTrash className="text-danger" />
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={() => onEdit(production._id)}
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
              <td className="fw-bold">{totalProductions}</td>
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
          <Button
            variant="danger"
            onClick={() => onDelete(selectedProductionId)}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Render the EditProduct modal */}
      {showEditModal && (
        <EditProduction
          showModal={showEditModal}
          handleCloseModal={() => setShowEditModal(false)}
          productionId={selectedProductionId}
          retrieveProductions={retrieveProductions}
        />
      )}

      <CreateProductions
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        retrieveProductions={retrieveProductions}
      />
    </>
  );
};

export default Productions;
