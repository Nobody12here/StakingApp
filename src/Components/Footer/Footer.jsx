import React from "react";
import "./Footer.css";
import { BsTelegram, BsTwitter } from "react-icons/bs";
import logo from "../Assets/logo.png"

export default function Footer() {
  return (
    <div className="main_footer">
      <div className="container">
        <div className="row">
          <div className="col-2 ">
          <img src={logo} className=" logo_adjsutment" alt="" />
          </div>

          
          {/* <div className="col-md-3">
            <a className="footer_links pt-0" href="">
              <li>Terms of Service</li>
            </a>
            <a className="footer_links" href="">
              <li>Privacy Policy</li>
            </a>
            <a className="footer_links" href="">
              <li>Cookies</li>
            </a>
          </div> */}
          <div className="col-md-4 text-md-end text-start">
            {/* <p className="footer_links">International Business</p> */}
            {/* <p className="footer_links">Centre, Rue du Gabian,</p> */}
            {/* <p className="footer_links">98000 Monaco</p> */}
            {/* <p className="footer_links">contact@bitcoinbsc.io</p> */}

            <div className="mt-5">
              {/* <p className="footer_links">BITCOIN ETH CORP</p> */}
              {/* <p className="footer_links">TVA: FR26337867214</p> */}
              <p className="footer_links d-flex ">
               
                
                © ∞ Token - All Rights Reserved.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="lower">
            <p>
              Disclaimer: Cryptocurrencies are volatile and could go down as
              well as up in value. Profits may be subject to capital gains or
              other taxes applicable in your jurisdiction. Always do your own
              research and only invest what you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
