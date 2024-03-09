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
import CreatePurchases from "../create/CreatePurchases";
import { FaTrash, FaEdit } from "react-icons/fa";
import EditPrchase from "../create/EditPurchases";
import { Modal, Button } from "react-bootstrap";

import axiosInstance from "../routes/AxiosInstance";
import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  PuffLoader,
} from "react-spinners";

const MySwal = withReactContent(Swal);

const Purchases = () => {
  const [showModal, setShowModal] = useState(false);

  const [state, setState] = useState({
    purchases: [],
    filteredPurchases: [],
    startDate: "",
    endDate: "",
    totalPurchases: 0,
    error: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrievePurchases();
  }, []);

  const retrievePurchases = () => {
    axiosInstance
      .get("/purchases")
      .then((res) => {
        if (res.data.success) {
          const purchases = res.data.existingPurchases.map((purchase) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(purchase.date));
            return { ...purchase, date: formattedDate };
          });

          setState({
            ...state,
            purchases,
            filteredPurchases: purchases,
            totalPurchases: calculateTotalPurchases(purchases),
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        setState({ ...state, error: "Internal Server Error" });
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    axiosInstance.delete(`/purchase/delete/${id}`).then((res) => {
      setShowDeleteModal(false);
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        text: "Deleted Successfully.",
      });

      retrievePurchases();
    });
  };

  const handleDeleteIconClick = (purchaseId) => {
    setSelectedPurchaseId(purchaseId);
    setShowDeleteModal(true);
  };

  const onEdit = (purchaseId) => {
    setSelectedPurchaseId(purchaseId);
    setShowEditModal(true);
  };

  const filterByDateRange = () => {
    const { purchases, startDate, endDate } = state;
    const result = purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return purchaseDate >= startDateObj && purchaseDate <= endDateObj;
    });

    setState({
      ...state,
      filteredPurchases: result,
      totalPurchases: calculateTotalPurchases(result),
    });
    setLoading(false);
  };

  const calculateTotalPurchases = (purchases) => {
    return purchases.reduce(
      (total, purchase) => total + parseInt(purchase.amount),
      0
    );
  };

  const handleStartDateChange = (e) => {
    setState({ ...state, startDate: e.target.value });
  };

  const handleEndDateChange = (e) => {
    setState({ ...state, endDate: e.target.value });
  };

  const handleFilterButtonClick = () => {
    filterByDateRange();
  };

  const generatePDF = () => {
    const { filteredPurchases, totalPurchases } = state;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: "EXPENSES DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*", "*", "*"],
          body: [
            [
              "#",
              "Recording Officer",
              "Date",
              "Category",
              "Quantity",
              "Amount",
            ],
            ...filteredPurchases.map((purchase, index) => [
              index + 1,
              purchase.worker,
              purchase.date,
              purchase.category,
              purchase.quantity,
              purchase.amount,
            ]),
            ["", "TOTAL", "", "", "", totalPurchases],
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

    pdfMake.createPdf(docDefinition).download("filtered_expenses_data.pdf");
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
        <div className="expenses-record h2 text-center mb-3">
          Expenses' Records
        </div>
        <div className="col-lg-3 mt-2 mb-2">
          <button className="btn btn-success mb-3" onClick={toggleModal}>
            Add Expense
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
              <th scope="col">Category</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {state.filteredPurchases.map((purchase, index) => (
              <tr key={purchase._id}>
                <th scope="row">{index + 1}</th>
                <td>{purchase.worker}</td>
                <td>{purchase.date}</td>
                <td>{purchase.category}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.amount}</td>
                <td>
                  <div className="d-flex flex-row">
                    <button
                      className="btn btn-white"
                      onClick={() => handleDeleteIconClick(purchase._id)}
                    >
                      <FaTrash className="text-danger" />
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={() => onEdit(purchase._id)}
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
              <td colSpan=""></td>
              <td className="fw-bold">Total</td>
              <td></td>
              <td></td>
              <td></td>

              <td className="fw-bold">{state.totalPurchases}</td>
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
          <Button variant="danger" onClick={() => onDelete(selectedPurchaseId)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Render the EditProduct modal */}
      {showEditModal && (
        <EditPrchase
          showModal={showEditModal}
          handleCloseModal={() => setShowEditModal(false)}
          purchaseId={selectedPurchaseId}
          retrievePurchases={retrievePurchases}
        />
      )}

      <CreatePurchases
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        retrievePurchases={retrievePurchases}
      />
    </>
  );
};

export default Purchases;
