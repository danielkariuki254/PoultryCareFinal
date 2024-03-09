import "bootstrap/dist/css/bootstrap.min.css";

import Salesgraph from "../graphs/Salesgraph";
import Navbar from "../components/Navbar";

import React, { useEffect, useState } from "react";
import axios from "axios";
// import background5 from "../assets/background4.jpg";
import background2 from "../assets/pc1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import axiosInstance from "../routes/AxiosInstance";
import {
  RingLoader,
  CircleLoader,
  SyncLoader,
  PuffLoader,
  ClipLoader,
} from "react-spinners";

const HomeComponent = () => {
  const [totalBirdQuantity, setTotalBirdQuantity] = useState(0);

  const [totalSaleQuantity, setTotalSaleQuantity] = useState(0);
  const [totalSaleAmnt, setTotalSaleAmnt] = useState(0);
  const [totalPurchaseQuantity, setTotalPurchaseQuantity] = useState(0);
  const [mortalityRate, setMortalityRate] = useState(0);
  const [remainingBirds, setRemainingBirds] = useState(0);
  const [unsoldEggs, setUnsoldEggs] = useState(0);

  const [totalProductionQuantity, setTotalProductionQuantity] = useState(0);

  const [totalMortalityQuantity, setTotalMortalityQuantity] = useState(0);

  const [totalProfit, setTotalProfit] = useState(0);

  const whatsappLink = "https://wa.me/+254798789477";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/mortalityRate")
      .then((response) => {
        const {
          totalMortalityQuantity,
          mortalityRate,
          totalBirdQuantity,
          remainingBirds,
        } = response.data;

        setMortalityRate(mortalityRate);
        setTotalMortalityQuantity(totalMortalityQuantity);
        setTotalBirdQuantity(totalBirdQuantity);
        setRemainingBirds(remainingBirds);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mortality data:", error);
        setLoading(false);
      });

    axiosInstance
      .get("/profit")
      .then((response) => {
        const {
          totalProfit,
          totalSaleQuantity,
          totalSaleAmnt,
          totalPurchaseQuantity,
          totalProductionQuantity,
          unsoldEggs,
        } = response.data;
        setTotalProfit(totalProfit);
        setTotalSaleQuantity(totalSaleQuantity);
        setTotalSaleAmnt(totalSaleAmnt);
        setTotalPurchaseQuantity(totalPurchaseQuantity);
        setTotalProductionQuantity(totalProductionQuantity);
        setUnsoldEggs(unsoldEggs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
        setLoading(false);
      });
  }, []);

  // const token = sessionStorage.getItem("token");
  // console.log("Token from home:", token);

  // if (loading) {
  //   // Render loading indicator while fetching data
  //   return (
  //     <div
  //       className="bg-primary"
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "blue",
  //         height: "100vh",
  //       }}
  //     >
  //       <SyncLoader color="black" />

  //       {/* <div class="spinner-border spinner-border-lg text-light"></div> */}
  //     </div>
  //   );
  // }

  return (
    <div className="ome">
      <Navbar />

      <div className="home ">
        <div className="title mt-4 d-flex flex-column align-items-center text-center">
          <h2
            className="text-primary font-weight-bold fw-bold"
            style={{
              marginTop: "65px",
            }}
          >
            POULTRYCARE
          </h2>
        </div>

        <div className="container mt-3">
          <h6 className="text-muted text-center">Yearly stats</h6>
          <div className="row top-element">
            <div className="col-lg-3 col-md-6 col-sm-6 col-6 ">
              <div className="element  rounded-4 p-3 shadow text-center bg-white mt-2">
                <h4 className="text-dark  fw-bolder">BirdsBought:</h4>
                {loading ? (
                  // Render loading indicator while fetching data
                  <h1 className="text-danger mt-3 fw-bolder">
                    <ClipLoader color="blue" />
                  </h1>
                ) : (
                  // Render totalBirdQuantity if not loading
                  <h1 className="text-danger mt-3 fw-bolder">
                    {totalBirdQuantity}
                  </h1>
                )}
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-6">
              <div className="element  rounded-4 p-3 shadow text-center bg-white mt-2">
                <h4 className="text-dark fw-bolder">EggsLayed:</h4>
                {loading ? (
                  // Render loading indicator while fetching data
                  <h1 className="text-danger mt-3 fw-bolder">
                    <ClipLoader color="blue" />
                  </h1>
                ) : (
                  // Render totalBirdQuantity if not loading
                  <h1 className="text-danger mt-3 fw-bolder">
                    {totalProductionQuantity}
                  </h1>
                )}
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-6">
              <div className="element  rounded-4 p-3 shadow text-center bg-white mt-2">
                <h4 className="text-dark fw-bolder">EggsSold:</h4>
                {loading ? (
                  // Render loading indicator while fetching data
                  <h1 className="text-danger mt-3 fw-bolder">
                    <ClipLoader color="blue" />
                  </h1>
                ) : (
                  // Render totalBirdQuantity if not loading
                  <h1 className="text-danger mt-3 fw-bolder">
                    {totalSaleQuantity}
                  </h1>
                )}
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-6">
              <div className="element  rounded-4 p-3 shadow text-center bg-white mt-2">
                <h4 className="text-dark fw-bolder">TotalSales:</h4>
                {loading ? (
                  // Render loading indicator while fetching data
                  <h1 className="text-danger mt-3 fw-bolder">
                    <ClipLoader color="blue" />
                  </h1>
                ) : (
                  // Render totalBirdQuantity if not loading
                  <h1 className="text-danger mt-3 fw-bolder">
                    {totalSaleAmnt}
                    <span className="text-muted h6">Kshs</span>
                  </h1>
                )}
              </div>
            </div>
          </div>
          <div className="bottom-element  column">
            <div className="main-boxes row">
              <div
                className="box2 border-right border-white rounded-5 p-3 shadow col-lg-6 col-md-6 col-sm-12 col-12 mt-4"
                style={{
                  backgroundImage: `url(${background2})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="right-column">
                      <div className="one-b text-center shadow rounded-5 p-3 m-2">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-black fw-bolder">
                            Total Deaths:
                          </span>
                          {loading ? (
                            // Render loading indicator while fetching data
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              <ClipLoader color="blue" />
                            </span>
                          ) : (
                            // Render totalBirdQuantity if not loading
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              {totalMortalityQuantity}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="one-c text-center shadow rounded-5 p-3 m-2">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-black fw-bolder">
                            BirdsRemaining:
                          </span>
                          {loading ? (
                            // Render loading indicator while fetching data
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              <ClipLoader color="blue" />
                            </span>
                          ) : (
                            // Render totalBirdQuantity if not loading
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              {remainingBirds}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="two-b text-center shadow rounded-5 p-3 m-2">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-black fw-bolder">
                            Mortality Rate:
                          </span>
                          {loading ? (
                            // Render loading indicator while fetching data
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              <ClipLoader color="blue" />
                            </span>
                          ) : (
                            // Render totalBirdQuantity if not loading
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              {mortalityRate}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="left-column">
                      <div className="three-c text-center shadow rounded-5 p-3 m-2">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-black fw-bolder">
                            AvailableEggs:
                          </span>
                          {loading ? (
                            // Render loading indicator while fetching data
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              <ClipLoader color="blue" />
                            </span>
                          ) : (
                            // Render totalBirdQuantity if not loading
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              {unsoldEggs}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="three-b text-center shadow rounded-5 p-3 m-2">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-black fw-bolder">
                            Expenses:
                          </span>
                          {loading ? (
                            // Render loading indicator while fetching data
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              <ClipLoader color="blue" />
                            </span>
                          ) : (
                            // Render totalBirdQuantity if not loading
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              {totalPurchaseQuantity}
                              <span className="text-muted h6">Kshs</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="four-b text-center shadow rounded-5 p-3 m-2">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-black fw-bolder">
                            Profit Accrued:
                          </span>
                          {loading ? (
                            // Render loading indicator while fetching data
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              <ClipLoader color="blue" />
                            </span>
                          ) : (
                            // Render totalBirdQuantity if not loading
                            <span
                              className="text-danger fw-bolder"
                              style={{ fontSize: "30px" }}
                            >
                              {totalProfit}
                              <span className="text-muted h6">Kshs</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box1 border-left border-white shadow rounded-5 p-3  col-lg-6 col-md-6 col-sm-12 bg-white mt-4">
                <Salesgraph />
              </div>
            </div>
          </div>
        </div>
        <footer className="text-center text-muted mt-5 mb-5">
          <div className="container">
            <h6>
              <p className="mt-3 font-weight-bold">
                &copy; 2024 DanielK{" "}
                <span className=" fw-bolder">
                  <a
                    href={whatsappLink}
                    // target="_blank"
                    className="text-decoration-none text-success"
                  >
                    <FontAwesomeIcon
                      icon={faWhatsapp}
                      className="text-success ms-1 "
                    />{" "}
                    0798789477
                  </a>
                </span>
                . All rights reserved.
              </p>
            </h6>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomeComponent;
