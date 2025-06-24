import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, 
  FiMapPin, FiMusic, FiArrowRight, FiYoutube, FiGlobe 
} from 'react-icons/fi';

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Find Studios", path: "/studios" },
    { name: "Find Artists", path: "/artists" },
    { name: "About Us", path: "/about" }
  ];
  
  const resourceLinks = [
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" }
  ];
  
  return (
    <footer className="relative">
      
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-600 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-600 opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-primary-900 text-white pt-28">
        <div className="container mx-auto px-4 pb-12 relative z-10">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand & About */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                    <FiMusic className="text-white text-xl" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    TuneLink
                  </span>
                </div>
                
                <p className="mb-8 text-gray-300 leading-relaxed max-w-lg">
                  Connecting musicians and studios across Sri Lanka, making music production and collaboration accessible to everyone. Join our community of creative professionals and take your sound to the next level.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: <FiFacebook />, color: "hover:bg-blue-600", url: "#" },
                    { icon: <FiTwitter />, color: "hover:bg-sky-500", url: "#" },
                    { icon: <FiInstagram />, color: "hover:bg-pink-600", url: "#" },
                    { icon: <FiYoutube />, color: "hover:bg-red-600", url: "#" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      className={`w-11 h-11 rounded-full bg-gray-800 ${social.color} flex items-center justify-center transition-all duration-300 hover:scale-110`}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-6 relative">
                Quick Links
                <span className="absolute -bottom-2 left-0 h-1 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                    >
                      <motion.span
                        className="mr-2 opacity-0 group-hover:opacity-100"
                        animate={{ x: [-5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiArrowRight />
                      </motion.span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-6 relative">
                Resources
                <span className="absolute -bottom-2 left-0 h-1 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {resourceLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                    >
                      <motion.span
                        className="mr-2 opacity-0 group-hover:opacity-100"
                        animate={{ x: [-5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiArrowRight />
                      </motion.span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Newsletter */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6 relative">
                Contact Us
                <span className="absolute -bottom-2 left-0 h-1 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
              </h3>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-300 group">
                  <div className="mr-3 mt-1 p-2 bg-gray-800 group-hover:bg-primary-700 rounded-lg transition-colors">
                    <FiMapPin className="text-primary-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors">123 Music Street, Colombo, Sri Lanka</span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <div className="mr-3 p-2 bg-gray-800 group-hover:bg-primary-700 rounded-lg transition-colors">
                    <FiPhone className="text-primary-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors">+94 11 234 5678</span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <div className="mr-3 p-2 bg-gray-800 group-hover:bg-primary-700 rounded-lg transition-colors">
                    <FiMail className="text-primary-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors">info@tunelink.lk</span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <div className="mr-3 p-2 bg-gray-800 group-hover:bg-primary-700 rounded-lg transition-colors">
                    <FiGlobe className="text-primary-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors">www.tunelink.lk</span>
                </li>
              </ul>

              {/* Newsletter */}
              <div>
                <h4 className="font-medium text-lg mb-4 text-white">Get updates</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 px-5 rounded-r-lg transition-all flex items-center justify-center group">
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>© {new Date().getFullYear()} TuneLink Sri Lanka. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-primary-400 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
