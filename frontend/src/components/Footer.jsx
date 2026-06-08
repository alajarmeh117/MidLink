import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HeartPulse,
  Globe,
} from "lucide-react";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="relative bg-[#04333a] text-white pt-12 pb-6 font-sans overflow-hidden">
      {/* Top Glowing Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#04333a] via-[#58e6fc] to-[#04333a] opacity-50"></div>

      {/* Abstract Background Decor */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#0a7a8c] rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <HeartPulse className="w-7 h-7 text-[#58e6fc]" />
              <h3 className="text-2xl font-black tracking-tight text-white font-serif">
                Mid<span className="text-[#58e6fc]">Link</span>
              </h3>
            </Link>
            <p className="text-[#c4f7ff] leading-relaxed text-sm opacity-90 pr-4">
              Jordan's premier hybrid healthcare platform. Bridging the gap
              between patients and doctors through advanced technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Home", "About", "Contact", "doctor"].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-gray-300 hover:text-[#58e6fc] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#58e6fc]">
                      ▹
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <Link
                    to="/feedback"
                    className="text-gray-300 hover:text-[#58e6fc] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#58e6fc]">
                      ▹
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      Feedback
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info (Updated) */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">
              Contact Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#58e6fc] shrink-0 mt-0.5" />
                <span>
                  Tech Headquarters <br />
                  <span className="text-xs opacity-70">
                    Amman, Jordan (Online Platform)
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3 hover:text-[#58e6fc] transition-colors">
                <Phone className="w-4 h-4 text-[#58e6fc] shrink-0" />
                <span className="font-bold tracking-wide">+962 6 123 4567</span>
              </li>
              <li className="flex items-center gap-3 hover:text-[#58e6fc] transition-colors">
                <Mail className="w-4 h-4 text-[#58e6fc] shrink-0" />
                <span>midlink81@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Connect</h4>
            <p className="text-gray-400 mb-4 text-xs leading-relaxed">
              Follow our development team for the latest platform features and
              updates.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/5 p-2.5 rounded-lg text-gray-300 hover:bg-[#58e6fc] hover:text-[#04333a] transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} MidLink System. Developed with{" "}
            <span className="text-[#58e6fc]">MidLink Team</span> in Jordan.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-[#58e6fc] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#58e6fc] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
