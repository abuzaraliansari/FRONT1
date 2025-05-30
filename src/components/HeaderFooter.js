import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../App.css";

export const Header = () => {
  const navigate = useNavigate();
  const { authData, setAuthData } = useContext(AuthContext);

  useEffect(() => {
    if (!authData && window.location.pathname !== "/") {
      navigate("/");
    }
  }, [authData, navigate]);

  const handleLogout = () => {
    setAuthData(null); // Clear authentication data
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="header">
      <div className="header-logo">
        <img
          src={`${process.env.PUBLIC_URL}/Images/BabralaLogo.jpeg`}
          alt="Logo"
        />

        <div className="header-title">
          <p>
            नगर पंचायत बबराला / जनपद सम्भल <br />
            Nagar Panchayat Babrala /District Sambhal
          </p>
        </div>

        <div className="swach-bharat">
          <img
            src={`${process.env.PUBLIC_URL}/Images/swach-bharat.png`}
            alt="Swachh Bharat"
          />
        </div>
      </div>
      <div className="username">
        {authData ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="header-welcome">Welcome {authData.user.username}</h2>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};


export const Banner = () => {
  useEffect(() => {
    const carouselElement = document.querySelector("#demo");
    if (carouselElement && window.bootstrap && window.bootstrap.Carousel) {
      new window.bootstrap.Carousel(carouselElement, {
        interval: 3000, // Slide every 3 seconds
        ride: "carousel", // Auto-slide
        pause: "hover", // Pause on hover
        wrap: true, // Loop slides
      });
    } else {
      console.error("Bootstrap Carousel is not initialized. Ensure Bootstrap JS is loaded.");
    }
  }, []);

  return (
    <section className="banners">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-0">
            <div className="position-relative">
              <div id="demo" className="carousel slide" data-bs-ride="carousel">
                {/* Carousel Indicators */}
                <div className="carousel-indicators">
                  {[...Array(6)].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#demo"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-current={index === 0 ? "true" : "false"}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>

                {/* Carousel Inner */}
                <div className="carousel-inner">
                  {[
                    { src: "Slider1.jpg", alt: "Slide 1" },
                    { src: "Slider2.jpg", alt: "Slide 2" },
                    { src: "banner_1.jpg", alt: "Slide 3" },
                    { src: "banner_4.jpg", alt: "Slide 4" },
                    { src: "banner_3.jpg", alt: "Slide 5" },
                    { src: "banner_2.jpg", alt: "Slide 6" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <div className="row bg-light">
                        <div className="col-12 d-flex justify-content-center">
                          <img
                            src={`${process.env.PUBLIC_URL}/Images/${item.src}`}
                            alt={item.alt}
                            className="d-block w-100 img-fluid"
                            loading={index > 1 ? "lazy" : "eager"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left and Right Controls */}
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#demo"
                  data-bs-slide="prev"
                  aria-label="Previous Slide"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#demo"
                  data-bs-slide="next"
                  aria-label="Next Slide"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <div className="footer">
      <div className="footer1">
        <section className="news_sect">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-11 col-lg-11 col-md-12 col-sm-12 m-auto">
                <div
                  className="govt_logo_slick-slider"
                  style={{ borderTop: "1px solid #a6aac1" }}
                >
                  <div className="element element-1">
                    <img
                      src={`${process.env.PUBLIC_URL}/Images/digital-india.png`}
                      alt="Digital India"
                    />
                  </div>
                  <div className="element element-2">
                    <img
                      src={`${process.env.PUBLIC_URL}/Images/makeinindia.png`}
                      alt="Make in India"
                    />
                  </div>
                  <div className="element element-3">
                    <img
                      src={`${process.env.PUBLIC_URL}/Images/india-gov.png`}
                      alt="India Gov"
                    />
                  </div>
                  <div className="element element-4">
                    <img
                      src={`${process.env.PUBLIC_URL}/Images/goidirectory.png`}
                      alt="GOI Directory"
                    />
                  </div>
                  <div className="element element-5">
                    <img
                      src={`${process.env.PUBLIC_URL}/Images/data-gov.png`}
                      alt="Data Gov"
                    />
                  </div>
                  <div className="element element-6">
                    <img
                      src={`${process.env.PUBLIC_URL}/Images/mygov.png`}
                      alt="My Gov"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <div className="footer2">

        <div className="footer2-1">
        <section className="footer_sect">
        <div className="container-fluid">
          <div className="row" style={{ background: "#363330" }}>
            <div className="col-xl-11 col-lg-11 col-md-12 col-sm-12 m-auto py-5">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="footer_ul">
                    <li>
                      <a href="#">Website Policies</a>
                    </li>
                    <li>
                      <a href="#">Help</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Terms and Conditions</a>
                    </li>
                    <li>
                      <a href="#">FeedBack</a>
                    </li>
                    <li>
                      <a href="#">Web Information Manager</a>
                    </li>
                    <li>
                      <a href="#">Visitor Analytics</a>
                    </li>
                    <li>
                      <a href="#">FAQ</a>
                    </li>
                    <li>
                      <a href="#">Disclaimer</a>
                    </li>
                  </ul>
                </div>
                <div className="col-sm-12 text-center pt-3 text-white">
                  <img src={`${process.env.PUBLIC_URL}/Images/cmf-logo.png`} />{" "}
                  | Website Content Managed by Department "Name" | Ministry
                  "Name"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
        <div className="footer2-2">
          <div className="cc">
            Copyright © 2022 IntMavens. All Rights Reserved.
          </div>
          <div className="mobile-email">
            <div>
              <a href="tel:+91-7972143020">+91-7972143020 </a>
            </div>
            <div> | </div>
            <div>
              <a href="mailto:contactus@intmavens.com">
                contactus@intmavens.com
              </a>
            </div>
          </div>
          <div className="Social-sites">
            <a href="https://www.facebook.com">fb</a>
            <a href="https://x.com">X</a>
            <a href="https://www.linkedin.com/login">in</a>
          </div>
          <div id="floater">
            <div className="dis_flx_soc">
              <a href="#">
                <img
                  src={`${process.env.PUBLIC_URL}/Images/facebook-icon.png`}
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src={`${process.env.PUBLIC_URL}/Images/insta-icon.png`}
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src={`${process.env.PUBLIC_URL}/Images/twitter-icon.png`}
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src={`${process.env.PUBLIC_URL}/Images/youtube-icon.png`}
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src={`${process.env.PUBLIC_URL}/Images/playstore-icon.png`}
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
