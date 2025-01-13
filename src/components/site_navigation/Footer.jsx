import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-red-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex flex-col items-start justify-center space-y-2">
              <span className="text-5xl font-bold uppercase tracking-tighter text-white">
                Spinning
              </span>
              <span className="text-5xl font-bold uppercase tracking-tighter text-yellow-500 ml-6 border-l-4 border-red-500 pl-4">
                Feel
              </span>
              <span className="text-5xl font-bold uppercase tracking-tighter text-blue-500 ml-12 border-l-4 border-white pl-4">
                Vinyl
              </span>
              <span className="text-5xl font-bold uppercase tracking-tighter text-white ml-18">
                Motion
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/new-releases" className="hover:underline">New Releases</Link></li>
              <li><Link to="/products" className="hover:underline">All Product Overview</Link></li>
              <li><Link to="/best-sellers" className="hover:underline">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:underline">Shipping Information</Link></li>
              <li><Link to="/returns" className="hover:underline">Returns & Exchanges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <p className="text-sm mb-2">Vinyl Street 65, Eindhoven</p>
            <p className="text-sm mb-2">Phone: 0630647594</p>
            <p className="text-sm mb-2">Email: info@spinningmotion.com</p>
            <div className="flex justify-center items-center space-x-8 mt-4">
              <a href="#" className="text-white hover:text-gray-400">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-gray-400">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white hover:text-gray-400">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white text-center text-sm">
          <p>&copy; 2024 Spinning Motion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;