import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import background3 from "../assets/pc1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "../routes/AxiosInstance";

const MySwal = withReactContent(Swal);

function SignUp() {
  // const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const whatsappLink = "https://wa.me/+254798789477";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axiosInstance.get("/register").then((res) => {
      // console.log(res.data)
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axiosInstance
      .post("/register", { email, username, password })
      .then(() => {
        // Alert user of successful registration
        MySwal.fire({
          icon: "success",
          title: "Registration",
          text: "Registration Successful.",
        });

        setEmail("");
        setUsername("");
        setPassword("");
        fetchUsers();
        navigate("/");
      })
      .catch((error) => {
        // Alert user of unsuccessful registration
        MySwal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "User Exist Or Invalid Credetials",
        });

        console.log("Unable to register user", error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div
          className="col-lg-6 col-md-6 col-sm-12 col-12  d-flex flex-column align-items-center justify-content-start"
          style={{
            height: "100vh",
            backgroundColor: "#ADD8E6",
            backgroundImage: `url(${background3})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-center text-primary fw-bolder display-1 mt-5">
            Welcome!!!🙏
          </h1>
        </div>
        <div
          className="col-lg-6 col-md-6 col-sm-12 col-12  text-dark d-flex justify-content-center"
          style={{ height: "100vh", backgroundColor: "#FFFDD0" }}
        >
          <div className="d-flex flex-column justify-content-center py-5 ">
            <div
              className="border border-white p-5 rounded-3 shadow"
              style={{ backgroundColor: "white" }}
            >
              <h2 className="text-center text-primary fw-bolder">Sign Up</h2>
              <form className="p-3" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Username Input */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ borderRight: "none" }}
                    />

                    <span
                      className="input-group-text bg-white "
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer", borderLeft: "none" }}
                    >
                      <FontAwesomeIcon
                        icon={!showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>
                {/* Button */}
                <button
                  className="btn btn-primary w-50 mx-auto d-block"
                  type="submit"
                >
                  Sign Up
                </button>
              </form>
              <p className="text-center mt-3 ">
                Already have an account?{" "}
                <Link className="text-decoration-none fw-bolder" to="/">
                  Login
                </Link>
              </p>
            </div>
            <div className="text-center text-dark mt-3 ">
              <div className="container">
                <h6>
                  <p className=" font-weight-bold ">
                    &copy; 2024 DanielK{" "}
                    <span className=" fw-bolder ">
                      <a
                        href={whatsappLink}
                        // target="_blank"
                        className="text-decoration-none text-primary"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
