import React from "react";
import "../styles/Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Course-Enrolment-System | Developed by Shaima Rahman</p>
    </footer>
  );
};

export default Footer;
