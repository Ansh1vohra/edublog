import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-4">
      <div className="container">
        <div className="m-2">
          <h5>About Us</h5>
          <p>
            Our platform is designed to be user-friendly, ensuring anyone can create or discover
            amazing content effortlessly. We believe in empowering voices and building a community
            that values creativity and knowledge sharing.
          </p>
        </div>
        {/* Added 'flex-col' to always be column on mobile */}
        <div className="flex flex-col sm:flex-row justify-between p-2 gap-4">
          <div>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/postblog" className="text-white">
                  Post a Blog
                </Link>
              </li>
              <li>
                <Link to="/studymaterial" className="text-white">
                  Study Material
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-map-marker-alt"></i> Vit University, Vellore, Tamil Nadu
              </li>
              <li>
                <i className="fas fa-phone"></i> +91 7015150092
              </li>
              <li>
                <i className="fas fa-envelope"></i> <a href="mailto:anshvohra1@gmail.com" target="_blank" rel="noreferrer" >anshvohra1@gmail.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>Follow Us</h5>
            <div className="social-links flex gap-2">
              <Link to="https://github.com/Ansh1vohra" target="_blank" rel="noreferrer" className="text-white">
                <i className="fab fa-github"></i>
              </Link>
              <Link to="https://www.linkedin.com/in/ansh1vohra" target="_blank" rel="noreferrer" className="text-white">
                <i className="fab fa-linkedin"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="mb-0">&copy; {new Date().getFullYear()} MIS Connect. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
