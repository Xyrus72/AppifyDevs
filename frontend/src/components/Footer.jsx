import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 text-center border-t-4 border-blue-600">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-left">
            <h3 className="text-2xl font-black text-blue-400 mb-4">ShopHub</h3>
            <p className="text-slate-400">Your trusted online shopping destination for premium products at unbeatable prices.</p>
          </div>
          <div className="text-left">
            <h4 className="font-bold mb-4 text-lg text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="text-left">
            <h4 className="font-bold mb-4 text-lg text-white">Follow Us</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-blue-400 transition">📱</a>
              <a href="#" className="hover:text-blue-400 transition">🐦</a>
              <a href="#" className="hover:text-blue-400 transition">📘</a>
              <a href="#" className="hover:text-blue-400 transition">📷</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8">
          <p className="text-slate-400">© 2026 ShopHub. All rights reserved. Made with ❤️ by ShopHub Team 🚀</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
