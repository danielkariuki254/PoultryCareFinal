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
import CreateSales from "../create/CreateSales";
import { FaTrash, FaEdit } from "react-icons/fa";
import EditSale from "../create/EditSales";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../routes/AxiosInstance";
import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  PuffLoader,
} from "react-spinners";

const MySwal = withReactContent(Swal);

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveSales();
  }, []);

  const retrieveSales = () => {
    const token = sessionStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    if (!decodedToken || !decodedToken.userId) {
      console.error("User id not found in token.");
      return;
    }

    const userId = decodedToken.userId;
    axiosInstance
      .get("/sales")
      .then((res) => {
        if (res.data.success) {
          const sales = res.data.existingSales.map((sale) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(sale.date));
            return { ...sale, date: formattedDate };
          });
          setSales(sales);
          setFilteredSales(sales);
          calculateTotalQuantity(sales);
          calculateTotalSales(sales);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Internal Server Error");
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    axiosInstance.delete(`/sale/delete/${id}`).then((res) => {
      setShowDeleteModal(false);
      MySwal.fire({
        icon: "success",
        title: "Sales",
        text: "Deleted Successfuly .",
      });
      retrieveSales();
    });
  };
  const handleDeleteIconClick = (saleId) => {
    setSelectedSaleId(saleId);
    setShowDeleteModal(true);
  };

  const onEdit = (saleId) => {
    setSelectedSaleId(saleId);
    setShowEditModal(true);
  };

  const filterByDateRange = () => {
    const result = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return saleDate >= startDateObj && saleDate <= endDateObj;
    });
    setFilteredSales(result);
    calculateTotalQuantity(result);
    calculateTotalSales(result);
    setLoading(false);
  };

  const calculateTotalQuantity = (sales) => {
    const totalQuantity = sales.reduce(
      (total, sale) => total + parseInt(sale.quantity),
      0
    );
    setTotalQuantity(totalQuantity);
  };

  const calculateTotalSales = (sales) => {
    const totalSales = sales.reduce(
      (total, sale) =>
        total + parseFloat(sale.quantity) * parseFloat(sale.price),
      0
    );
    setTotalSales(totalSales);
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
      { text: " SALES DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Category", "Rate", "Quantity"],
            ...filteredSales.map((sale, index) => [
              index + 1,
              sale.worker,
              sale.date,
              sale.category,
              sale.price,
              sale.quantity,
            ]),
            ["", "TOTAL QUANTITY SOLD", "", "", "", totalQuantity],
            ["", "TOTAL SALES", "", "", "", totalSales],
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
    pdfDoc.download("filtered_sales_data.pdf");
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
        <div className="sales-record h2 text-center mb-3">Sales' Records</div>
        <div className="col-lg-3 mt-2 mb-2">
          <button className="btn btn-success mb-3" onClick={toggleModal}>
            Add Sales
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
              <th scope="col">Category</th>
              <th scope="col">Rate</th>
              <th scope="col">Quantity Sold</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredSales.map((sale, index) => (
              <tr key={sale._id}>
                <th scope="row">{index + 1}</th>
                <td>{sale.worker}</td>
                <td>{sale.date}</td>
                <td>{sale.category}</td>
                <td>{sale.price}</td>
                <td>{sale.quantity}</td>
                <td>
                  <div className="d-flex flex-row">
                    <button
                      className="btn btn-white"
                      onClick={() => handleDeleteIconClick(sale._id)}
                    >
                      <FaTrash className="text-danger" />
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={() => onEdit(sale._id)}
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
              <td className="fw-bold">Total Quantity Sold</td>
              <td></td>
              <td></td>
              <td></td>
              <td className="fw-bold">{totalQuantity}</td>
            </tr>
            <tr>
              <td colSpan="1"></td>
              <td className="fw-bold">Total Sales</td>
              <td></td>
              <td></td>
              <td></td>
              <td className="fw-bold">{totalSales}</td>
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
          <Button variant="danger" onClick={() => onDelete(selectedSaleId)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Render the EditProduct modal */}
      {showEditModal && (
        <EditSale
          showModal={showEditModal}
          handleCloseModal={() => setShowEditModal(false)}
          saleId={selectedSaleId}
          retrieveSales={retrieveSales}
        />
      )}

      <CreateSales
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        retrieveSales={retrieveSales}
      />
    </>
  );
};

export default Sales;
