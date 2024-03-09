import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateBirds from "../create/CreateBirds";
import { FaTrash, FaEdit } from "react-icons/fa";
import EditBird from "../create/EditBirds";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";
import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  PuffLoader,
} from "react-spinners";

const MySwal = withReactContent(Swal);

const Birds = () => {
  const [birds, setBirds] = useState([]);
  const [filteredBirds, setFilteredBirds] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalBirds, setTotalBirds] = useState(0);
  const [setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBirdId, setSelectedBirdId] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveBirds();
  }, []);

  const retrieveBirds = () => {
    axiosInstance
      .get("/birds")
      .then((res) => {
        if (res.data.success) {
          const formattedBirds = res.data.existingBirds.map((bird) => ({
            ...bird,
            date: new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(bird.date)),
          }));
          setBirds(formattedBirds);
          setFilteredBirds(formattedBirds);
          calculateTotalBirds(formattedBirds);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Internal Server Error");
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    axiosInstance.delete(`/bird/delete/${id}`).then((res) => {
      setShowDeleteModal(false);
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        text: "Deleted Successfully.",
      });
      retrieveBirds();
    });
  };

  const handleDeleteIconClick = (birdId) => {
    setSelectedBirdId(birdId);
    setShowDeleteModal(true);
  };

  const onEdit = (birdId) => {
    setSelectedBirdId(birdId);
    setShowEditModal(true);
  };

  const filterByDateRange = () => {
    const result = birds.filter((bird) => {
      const birdDate = new Date(bird.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return birdDate >= startDateObj && birdDate <= endDateObj;
    });

    setFilteredBirds(result);
    calculateTotalBirds(result);
    setLoading(false);
  };

  const calculateTotalBirds = (birdList) => {
    const total = birdList.reduce(
      (total, bird) => total + parseInt(bird.quantity),
      0
    );
    setTotalBirds(total);
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
      { text: " BIRDS DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Birds Bought"],
            ...filteredBirds.map((bird, index) => [
              index + 1,
              bird.worker,
              bird.date,
              bird.quantity,
            ]),
            ["", "TOTAL", "", totalBirds],
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
    pdfDoc.download("filtered_bird_data.pdf");
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
        <div className="birds-record h2 text-center mb-3">Birds' Records</div>
        <div className="col-lg-3 mt-2 mb-2">
          <button className="btn btn-success mb-3" onClick={toggleModal}>
            Add Birds
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
              <th scope="col">Birds Bought</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBirds.map((bird, index) => (
              <tr key={bird._id}>
                <th scope="row">{index + 1}</th>
                <td>{bird.worker}</td>
                <td>{bird.date}</td>
                <td>{bird.quantity}</td>
                <td>
                  <div className="d-flex flex-row">
                    <button
                      className="btn btn-white"
                      onClick={() => handleDeleteIconClick(bird._id)}
                    >
                      <FaTrash className="text-danger" />
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={() => onEdit(bird._id)}
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
              <td className="fw-bold">{totalBirds}</td>
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
          <Button variant="danger" onClick={() => onDelete(selectedBirdId)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Render the EditProduct modal */}
      {showEditModal && (
        <EditBird
          showModal={showEditModal}
          handleCloseModal={() => setShowEditModal(false)}
          birdId={selectedBirdId}
          retrieveBirds={retrieveBirds}
        />
      )}

      <CreateBirds
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        retrieveBirds={retrieveBirds}
      />
    </>
  );
};

export default Birds;
