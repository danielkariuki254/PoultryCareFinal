import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../routes/AxiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SyncLoader, ClipLoader } from "react-spinners";

const MonthlySalesLineChart = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [chartDimensions, setChartDimensions] = useState({
    width: 800, // Initial width
    height: 300, // Initial height
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/calculateTotalSalesByMonth")
      .then((response) => {
        setMonthlySales(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Handle window resize and update chart dimensions
  const handleResize = useCallback(() => {
    const chartContainer = document.getElementById("chart-container");
    if (chartContainer) {
      const { clientWidth, clientHeight } = chartContainer;
      // Subtracting a margin to prevent potential overflow
      const newWidth = clientWidth - 40;
      setChartDimensions({
        width: newWidth,
        height: clientHeight,
      });
    }
  }, []);

  // Attach window resize event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size calculation
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  if (loading) {
    // Render loading indicator while fetching data
    return (
      <div
        className="bg-light"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div style={{ width: "100px", height: "100px" }}>
          <ClipLoader color="black" />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h3 className="text-center mt-3 text-primary ">Monthly Sales Stats</h3>
      <div className="d-flex justify-content-center">
        <div
          className="col-lg-12 col-md-12 col-sm-12"
          id="chart-container"
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <LineChart
            width={chartDimensions.width}
            height={chartDimensions.height}
            data={monthlySales}
            margin={{ right: 20 }} // Add margin to prevent overflow
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="month" angle={-90} textAnchor="end" />
            <YAxis
              label={{
                value: "SALES (Kshs)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "blue" },
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesLineChart;
