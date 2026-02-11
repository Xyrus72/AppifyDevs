import React from 'react'

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 bg-white/95 backdrop-blur-md shadow-lg">
        <h1 className="text-4xl font-black bg-gradient-to-r from-slate-700 via-blue-600 to-slate-700 bg-clip-text text-transparent">ShopHub</h1>
        <div className="hidden md:flex gap-10 font-semibold">
          <a href="#" className="text-slate-600 hover:text-blue-600 transition duration-300 text-lg">Home</a>
          <a href="#" className="text-slate-600 hover:text-blue-600 transition duration-300 text-lg">Products</a>
          <a href="#" className="text-slate-600 hover:text-blue-600 transition duration-300 text-lg">About</a>
          <a href="#" className="text-slate-600 hover:text-blue-600 transition duration-300 text-lg">Contact</a>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition font-bold text-lg">Sign In</button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-40 text-center px-6 bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
        <div className="inline-block mb-6 px-6 py-2 bg-blue-100 rounded-full">
          <span className="text-blue-700 font-bold text-sm">✨ New Arrivals Daily</span>
        </div>
        <h2 className="text-8xl font-black mb-8 text-gray-900 leading-tight">Shop Smarter, <br/> Save Bigger</h2>
        <p className="text-2xl text-slate-600 mb-16 max-w-3xl leading-relaxed font-light">Discover thousands of premium products at unbeatable prices. Fast shipping, easy returns, and amazing deals every single day.</p>
        <div className="flex gap-5">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition duration-300 transform hover:scale-105">Explore Now</button>
          <button className="border-2 border-slate-300 text-slate-700 px-12 py-5 rounded-xl font-bold text-xl hover:bg-slate-100 transition duration-300">Learn More</button>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="bg-gradient-to-br from-blue-50 to-slate-100 p-12 rounded-3xl text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-3 border border-blue-100">
            <div className="text-7xl mb-6 bg-gradient-to-br from-blue-400 to-slate-600 bg-clip-text">🚚</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
            <p className="text-slate-600 text-lg leading-relaxed">Delivery in 2-3 business days to your doorstep</p>
          </div>
          <div className="bg-gradient-to-br from-slate-100 to-blue-50 p-12 rounded-3xl text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-3 border border-slate-200">
            <div className="text-7xl mb-6">💳</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">100% Secure</h3>
            <p className="text-slate-600 text-lg leading-relaxed">All transactions protected with encryption</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-slate-50 p-12 rounded-3xl text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-3 border border-blue-200">
            <div className="text-7xl mb-6">↩️</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Hassle Free</h3>
            <p className="text-slate-600 text-lg leading-relaxed">30-day easy returns, no questions asked</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-blue-100 p-12 rounded-3xl text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-3 border border-slate-300">
            <div className="text-7xl mb-6">⭐</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Best Prices</h3>
            <p className="text-slate-600 text-lg leading-relaxed">Unmatched deals and competitive rates</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-8 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-black mb-4 text-center text-gray-900">Shop by Category</h2>
          <p className="text-center text-slate-600 text-xl mb-16">Browse our curated collections</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-slate-600 p-20 rounded-3xl text-center text-white hover:scale-105 transition duration-300 cursor-pointer shadow-2xl hover:shadow-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="text-8xl mb-6 relative z-10 transform group-hover:scale-110 transition duration-300">👗</div>
              <h3 className="text-4xl font-black relative z-10">Fashion</h3>
              <p className="text-indigo-100 mt-4 text-lg relative z-10">Trendy styles & classics</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-slate-600 p-20 rounded-3xl text-center text-white hover:scale-105 transition duration-300 cursor-pointer shadow-2xl hover:shadow-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="text-8xl mb-6 relative z-10 transform group-hover:scale-110 transition duration-300">💻</div>
              <h3 className="text-4xl font-black relative z-10">Electronics</h3>
              <p className="text-cyan-100 mt-4 text-lg relative z-10">Latest tech gadgets</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 via-slate-500 to-blue-600 p-20 rounded-3xl text-center text-white hover:scale-105 transition duration-300 cursor-pointer shadow-2xl hover:shadow-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="text-8xl mb-6 relative z-10 transform group-hover:scale-110 transition duration-300">🏠</div>
              <h3 className="text-4xl font-black relative z-10">Home & Garden</h3>
              <p className="text-orange-100 mt-4 text-lg relative z-10">Comfort & style for home</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 border-2 border-slate-200 rounded-2xl hover:border-blue-400 transition">
            <div className="text-5xl font-black text-blue-600 mb-2">500K+</div>
            <p className="text-slate-600 text-lg">Happy Customers</p>
          </div>
          <div className="text-center p-8 border-2 border-slate-200 rounded-2xl hover:border-blue-400 transition">
            <div className="text-5xl font-black text-blue-600 mb-2">1M+</div>
            <p className="text-slate-600 text-lg">Products Available</p>
          </div>
          <div className="text-center p-8 border-2 border-slate-200 rounded-2xl hover:border-blue-400 transition">
            <div className="text-5xl font-black text-blue-600 mb-2">24/7</div>
            <p className="text-slate-600 text-lg">Customer Support</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-700 via-blue-700 to-slate-700 mx-8 my-20 p-20 rounded-3xl text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black mb-6">Join Our Community</h2>
          <p className="text-xl mb-12 opacity-95">Get exclusive deals, early access to new products, and special offers delivered to your inbox</p>
          <div className="flex gap-3 max-w-xl mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-8 py-5 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold text-lg" />
            <button className="bg-blue-500 hover:bg-blue-600 px-12 py-5 rounded-xl font-black text-lg transition duration-300 transform hover:scale-105">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 text-center border-t-4 border-blue-600">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-left">
              <h3 className="text-2xl font-black text-blue-400 mb-4">ShopHub</h3>
              <p className="text-slate-400">Your trusted online shopping destination</p>
            </div>
            <div className="text-left">
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy</a></li>
              </ul>
            </div>
            <div className="text-left">
              <h4 className="font-bold mb-4 text-lg">Follow Us</h4>
              <p className="text-slate-400">📱 Social Media Links Coming Soon</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8">
            <p className="text-slate-400">© 2026 ShopHub. All rights reserved. 🚀</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
