import { Link } from "react-router-dom";
import { FaPlaneDeparture, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane } from "react-icons/fa";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Column 1 - Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand mb-3">
              <FaPlaneDeparture style={{ color: "var(--accent-color)" }} />
              <span>Aeroglide</span>
            </div>
            <p className="small mb-4 text-muted" style={{ lineHeight: "1.6" }}>
              Experience the joy of seamless air travel. We connect you with top-rated global airlines for safe, fast, and comfortable journeys.
            </p>
            <div className="footer-social-icons">
              <a href="#" className="social-icon-btn"><FaFacebookF size={14} /></a>
              <a href="#" className="social-icon-btn"><FaTwitter size={14} /></a>
              <a href="#" className="social-icon-btn"><FaInstagram size={14} /></a>
              <a href="#" className="social-icon-btn"><FaLinkedinIn size={14} /></a>
            </div>
          </div>

          {/* Column 2 - Navigation */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Explore</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/flights">Flights List</Link></li>
              <li><Link to="/search">Search Flight</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3 - Information */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Support</h5>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Flight Status</a></li>
              <li><a href="#">Travel Advisory</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h5>Newsletter</h5>
            <p className="small text-muted mb-3">
              Subscribe to get latest travel updates and discount offers!
            </p>
            <div className="footer-input-group">
              <input type="email" placeholder="Your email address" />
              <button type="button">
                <FaPaperPlane size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0">
            © 2026 Aeroglide Inc. All Rights Reserved.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted small text-decoration-none">Privacy Policy</a>
            <a href="#" className="text-muted small text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;