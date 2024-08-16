import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <img src={logo} alt="Evangadi Logo" className="footer-logo" />
          <div className="social-icons">
            <a href="https://www.facebook.com/evangaditech" target='_blank' className="social-icon"><FaFacebook /></a>
            <a href="https://www.instagram.com/evangaditech/" target='_blank'  className="social-icon"><FaInstagram /></a>
            <a href="https://www.youtube.com/@EvangadiTech" target='_blank'  className="social-icon"><FaYoutube /></a>
          </div>
        </div>
        <div className="footer-links">
          <h3>Useful Links</h3>
          <ul>
            <li><a href="#">How it works</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h3>Contact Info</h3>
          <p>Evangadi Networks</p>
          <p>support@evangadi.com</p>
          <p>+1-202-386-2702</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
