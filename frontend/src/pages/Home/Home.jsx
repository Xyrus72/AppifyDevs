import React from 'react'

const Home = () => {
  return (
    <div className="w-full bg-gray-950 text-white">
      {/* Hero Section - Premium Dark Design */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl transform -translate-x-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl">
          <div className="inline-block mb-8 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full backdrop-blur-lg">
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-bold text-sm">✨ Next-Gen Shopping Experience</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text">
              Elevate Your
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
              Shopping Game
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed mx-auto font-light">
            Discover curated collections of premium products. Experience seamless shopping with lightning-fast delivery, secure transactions, and exceptional customer care.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative px-10 py-4 font-bold text-lg text-white overflow-hidden rounded-2xl transform transition duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                Explore Store
                <span className="group-hover:translate-x-1 transition duration-300">→</span>
              </span>
            </button>
            <button className="px-10 py-4 font-bold text-lg border-2 border-gray-600 hover:border-blue-400 text-gray-200 rounded-2xl transition duration-300 hover:bg-blue-500/10 hover:text-blue-300">
              View Deals
            </button>
          </div>

          {/* Stats below hero */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">500K+</div>
              <p className="text-gray-400 text-sm mt-2">Happy Customers</p>
            </div>
            <div className="text-center border-l border-r border-gray-700">
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">1M+</div>
              <p className="text-gray-400 text-sm mt-2">Products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">24/7</div>
              <p className="text-gray-400 text-sm mt-2">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-8 bg-gray-900 relative">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-6xl font-black mb-4 text-center text-white">Why Choose Us</h2>
          <p className="text-center text-gray-400 text-xl mb-20">Experience the difference with our premium features</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500/50 transition duration-300 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
              <div className="text-6xl mb-6 group-hover:scale-110 transition duration-300">🚚</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">2-3 business day delivery to your doorstep</p>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition duration-300 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-2">
              <div className="text-6xl mb-6 group-hover:scale-110 transition duration-300">🔐</div>
              <h3 className="text-2xl font-bold mb-3 text-white">100% Secure</h3>
              <p className="text-gray-400 leading-relaxed">Bank-level encryption for all transactions</p>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500/50 transition duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 transform hover:-translate-y-2">
              <div className="text-6xl mb-6 group-hover:scale-110 transition duration-300">↩️</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Hassle Free</h3>
              <p className="text-gray-400 leading-relaxed">30-day returns with zero questions asked</p>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-pink-500/50 transition duration-300 hover:shadow-2xl hover:shadow-pink-500/10 transform hover:-translate-y-2">
              <div className="text-6xl mb-6 group-hover:scale-110 transition duration-300">⭐</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Best Prices</h3>
              <p className="text-gray-400 leading-relaxed">Unbeatable deals and price matching</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-black mb-4 text-center text-white">Shop by Category</h2>
          <p className="text-center text-gray-400 text-xl mb-20">Explore our curated collections</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-blue-600 to-blue-900 text-white cursor-pointer transform transition duration-300 hover:scale-105 shadow-2xl">
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-20 text-center">
                <div className="text-8xl mb-6 transform group-hover:scale-125 transition duration-300">👗</div>
                <h3 className="text-4xl font-black mb-2">Fashion</h3>
                <p className="text-blue-100 text-lg">Trendy styles & timeless classics</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-purple-600 to-purple-900 text-white cursor-pointer transform transition duration-300 hover:scale-105 shadow-2xl">
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-20 text-center">
                <div className="text-8xl mb-6 transform group-hover:scale-125 transition duration-300">💻</div>
                <h3 className="text-4xl font-black mb-2">Electronics</h3>
                <p className="text-purple-100 text-lg">Latest tech innovations & gadgets</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-cyan-600 to-cyan-900 text-white cursor-pointer transform transition duration-300 hover:scale-105 shadow-2xl">
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-20 text-center">
                <div className="text-8xl mb-6 transform group-hover:scale-125 transition duration-300">🏠</div>
                <h3 className="text-4xl font-black mb-2">Home & Garden</h3>
                <p className="text-cyan-100 text-lg">Comfort & style for your space</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black mb-20 text-center text-white">Trusted by Millions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 transition duration-300 text-center transform hover:-translate-y-2">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-3">500K+</div>
              <p className="text-gray-400 text-lg font-semibold">Happy Customers</p>
            </div>
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500 transition duration-300 text-center transform hover:-translate-y-2">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-3">1M+</div>
              <p className="text-gray-400 text-lg font-semibold">Products Available</p>
            </div>
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500 transition duration-300 text-center transform hover:-translate-y-2">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-3">24/7</div>
              <p className="text-gray-400 text-lg font-semibold">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-8 my-20 px-12 py-20 rounded-3xl bg-gradient-to-r from-gray-800 via-blue-900 to-gray-800 text-white shadow-2xl relative overflow-hidden border border-gray-700">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-black mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-200 mb-12 opacity-90">Exclusive deals, early access to new products, and special offers delivered to your inbox</p>
          <div className="flex gap-3 max-w-xl mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-8 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50 font-semibold text-lg bg-gray-100 hover:bg-white transition" />
            <button className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 font-black text-lg rounded-xl transition duration-300 transform hover:scale-105 shadow-lg">
              <span className="group-hover:translate-x-1 transition duration-300 inline-block">Subscribe</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  )
}

export default Home
