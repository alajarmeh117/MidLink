import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HeartPulse,
} from "lucide-react";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="relative bg-[#04333a] text-white pt-20 pb-10 font-serif overflow-hidden">
      {/* Top Glowing Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#04333a] via-[#58e6fc] to-[#04333a] opacity-50"></div>

      {/* Abstract Background Decor */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0a7a8c] rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <HeartPulse className="w-8 h-8 text-[#58e6fc]" />
              <h3 className="text-3xl font-extrabold tracking-wide text-white">
                Mid<span className="text-[#58e6fc]">Link</span>
              </h3>
            </Link>
            <p className="text-[#c4f7ff] leading-relaxed text-sm">
              Your trusted platform for smart medical appointments and seamless
              healthcare services across Jordan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "About", "Contact", "Our Doctors"].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-gray-300 hover:text-[#58e6fc] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
                      ▹
                    </span>
                    {item}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <Link
                    to="/feedback"
                    className="text-gray-300 hover:text-[#58e6fc] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
                      ▹
                    </span>{" "}
                    Feedback
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3 hover:text-[#58e6fc] transition-colors">
                <MapPin className="w-5 h-5 text-[#58e6fc] shrink-0 mt-1" />
                <span>Medical Street, Amman, Jordan</span>
              </li>
              <li className="flex items-center gap-3 hover:text-[#58e6fc] transition-colors">
                <Phone className="w-5 h-5 text-[#58e6fc] shrink-0" />
                <span>+962 78 005 1538</span>
              </li>
              <li className="flex items-center gap-3 hover:text-[#58e6fc] transition-colors">
                <Mail className="w-5 h-5 text-[#58e6fc] shrink-0" />
                <span>info@midlink.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">
              Follow Us
            </h4>
            <p className="text-gray-300 mb-6 text-sm">
              Stay updated with our latest health tips and platform updates.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 p-3 rounded-xl text-white hover:bg-[#58e6fc] hover:text-[#04333a] transition-colors shadow-lg"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MidLink Healthcare. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
