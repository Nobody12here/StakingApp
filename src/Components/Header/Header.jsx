import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Header.css";
import { BsTelegram, BsTwitter } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";


export default function Header() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" className="main_nav_bar">
        <Container>
          <Navbar.Brand href="#home" className="logo_main_width">
          <Link to="/">
            <img src={logo} alt="" />
            </Link>
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
          <span className="d-block d-lg-none" onClick={() => setShow(!show)}>
            {show ? (
              <>
                <RxCross2 className="text-white fs-1" />{" "}
              </>
            ) : (
              <>
                <AiOutlineMenu className="text-white fs-1" />
              </>
            )}
          </span>
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className={show ? "show" : ""}
          >
            <Nav className="ms-auto">


              <Nav.Link
                className="headeder_links gap_stakw"
                onClick={handleClose}
              >
           {/* <Link to="staking_page" className="headeder_links text-decoration-none">      Staking </Link> */}
              </Nav.Link>

              
              {/* <Nav.Link href="#pricing" className="headeder_links" onClick={handleClose}>English</Nav.Link> */}
            </Nav>
            <Nav className="ms-auto d-flex  align-items-center gap-2">
              
              <div className="tree_btn d-flex gap-2">
                <button className="main_header_btn">Stake your TOKEN</button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
