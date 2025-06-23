import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin, FiMusic, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="relative">
      {/* Wave SVG Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 transform rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-16 w-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
      
      <div className="bg-gray-900 text-white pt-20">
        <div className="container mx-auto px-4 pb-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About */}
            <div className="animate-slide-up">
              <div className="flex items-center space-x-2 mb-5">
                <div className="bg-gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                  <FiMusic className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold text-gradient-primary">TuneLink</span>
              </div>
              <p className="mb-6 text-gray-300 leading-relaxed">
                Connecting musicians and studios across Sri Lanka, making music production and collaboration accessible to everyone.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors duration-300">
                  <FiFacebook className="text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors duration-300">
                  <FiTwitter className="text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors duration-300">
                  <FiInstagram className="text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <h3 className="text-xl font-semibold mb-5 border-b border-gray-700 pb-2">Quick Links</h3>
              <ul className="space-y-3">
                {/*
                  { name: "Home", path: "/" },
                  { name: "Find Studios", path: "/studios" },
                  { name: "Find Artists", path: "/artists" },
                  { name: "About Us", path: "/about" }
                */}
                {/*
                  <li key={index}>
                    <Link to={link.path} className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                      <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                */}
              </ul>
            </div>

            {/* Resources */}
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-xl font-semibold mb-5 border-b border-gray-700 pb-2">Resources</h3>
              <ul className="space-y-3">
                {/*
                  { name: "Blog", path: "#" },
                  { name: "FAQ", path: "#" },
                  { name: "Terms of Service", path: "#" },
                  { name: "Privacy Policy", path: "#" }
                */}
                {/*
                  <li key={index}>
                    <a href={link.path} className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                      <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                      {link.name}
                    </a>
                  </li>
                */}
              </ul>
            </div>

            {/* Contact */}
            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <h3 className="text-xl font-semibold mb-5 border-b border-gray-700 pb-2">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-300">
                  <FiMapPin className="mr-3 mt-1 text-primary-400" />
                  <span>123 Music Street, Colombo, Sri Lanka</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <FiPhone className="mr-3 text-primary-400" />
                  <span>+94 11 234 5678</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <FiMail className="mr-3 text-primary-400" />
                  <span>info@tunelink.lk</span>
                </li>
              </ul>

              {/* Newsletter */}
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-3 text-gray-200">Subscribe to our newsletter</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button className="bg-primary-600 hover:bg-primary-700 px-4 rounded-r-lg transition-colors">
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} TuneLink Sri Lanka. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
