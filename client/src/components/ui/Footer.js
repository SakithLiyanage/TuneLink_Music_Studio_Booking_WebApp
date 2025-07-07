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
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-600 opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="bg-gradient-to-br from-dark via-primary-900 to-accent-900 text-white pt-32">
        <div className="max-w-7xl mx-auto px-4 pb-12 relative z-10">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Brand & About */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-br from-primary-700 via-primary-500 to-accent-400 w-14 h-14 rounded-2xl flex items-center justify-center shadow-glass">
                    <FiMusic className="text-white text-2xl" />
                  </div>
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-white via-primary-100 to-accent-200 bg-clip-text text-transparent tracking-tight">
                    TuneLink
                  </span>
                </div>
                
                <p className="mb-10 text-gray-300 leading-relaxed max-w-lg text-lg font-medium">
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
                      className={`w-12 h-12 rounded-xl bg-glass/20 backdrop-blur-xs ${social.color} flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 shadow-glass`}
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
              <h3 className="text-2xl font-bold mb-8 relative">
                Quick Links
                <span className="absolute -bottom-2 left-0 h-1 w-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group font-medium text-lg"
                    >
                      <motion.span
                        className="mr-3 opacity-0 group-hover:opacity-100"
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
              <h3 className="text-2xl font-bold mb-8 relative">
                Resources
                <span className="absolute -bottom-2 left-0 h-1 w-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                {resourceLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group font-medium text-lg"
                    >
                      <motion.span
                        className="mr-3 opacity-0 group-hover:opacity-100"
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
              <h3 className="text-2xl font-bold mb-8 relative">
                Contact Us
                <span className="absolute -bottom-2 left-0 h-1 w-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"></span>
              </h3>
              
              <ul className="space-y-5 mb-10">
                <li className="flex items-start text-gray-300 group">
                  <div className="mr-4 mt-1 p-3 bg-glass/20 group-hover:bg-primary-700 rounded-xl transition-colors backdrop-blur-xs border border-white/10">
                    <FiMapPin className="text-primary-400 group-hover:text-white text-lg" />
                  </div>
                  <span className="group-hover:text-white transition-colors font-medium">123 Music Street, Colombo, Sri Lanka</span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <div className="mr-4 p-3 bg-glass/20 group-hover:bg-primary-700 rounded-xl transition-colors backdrop-blur-xs border border-white/10">
                    <FiPhone className="text-primary-400 group-hover:text-white text-lg" />
                  </div>
                  <span className="group-hover:text-white transition-colors font-medium">+94 11 234 5678</span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <div className="mr-4 p-3 bg-glass/20 group-hover:bg-primary-700 rounded-xl transition-colors backdrop-blur-xs border border-white/10">
                    <FiMail className="text-primary-400 group-hover:text-white text-lg" />
                  </div>
                  <span className="group-hover:text-white transition-colors font-medium">info@tunelink.lk</span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <div className="mr-4 p-3 bg-glass/20 group-hover:bg-primary-700 rounded-xl transition-colors backdrop-blur-xs border border-white/10">
                    <FiGlobe className="text-primary-400 group-hover:text-white text-lg" />
                  </div>
                  <span className="group-hover:text-white transition-colors font-medium">www.tunelink.lk</span>
                </li>
              </ul>

              {/* Newsletter */}
              <div>
                <h4 className="font-bold text-xl mb-5 text-white">Get updates</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-glass/20 border border-white/20 rounded-l-xl px-5 py-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs text-white placeholder-gray-400 font-medium"
                  />
                  <button className="bg-gradient-to-r from-primary-700 to-accent-400 hover:from-primary-800 hover:to-accent-500 px-6 rounded-r-xl transition-all flex items-center justify-center group shadow-glass">
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform text-xl" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
