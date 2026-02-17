import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getAuthHeaders } from '../../../services/authService'

/**
 * Product Management Page
 * Features: View, Add, Edit, Delete products
 * CRUD functionality for product catalog
 */
const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    imageURL: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${baseUrl}/api/products?active=false`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      const list = data.products || []
      setProducts(list)
    } catch (err) {
      console.error('Error loading products:', err)
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({ name: '', category: '', price: '', stock: '', description: '', imageURL: '' })
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      imageURL: product.imageURL || ''
    })
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return

    try {
      const res = await fetch(`${baseUrl}/api/products/${product._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (!res.ok) throw new Error('Failed to delete product')
      await loadProducts()
      alert('✓ Product deleted successfully')
    } catch (err) {
      console.error('Error deleting product:', err)
      alert(err.message || 'Failed to delete product')
    }
  }

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      alert('❌ Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      const payload = {
        name: formData.name,
        category: formData.category || 'general',
        price: Number(formData.price),
        stock: Number(formData.stock || 0),
        description: formData.description || '',
        imageURL: formData.imageURL || ''
      }

      const url = editingProduct
        ? `${baseUrl}/api/products/${editingProduct._id}`
        : `${baseUrl}/api/products`
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Failed to save product')
      }

      await loadProducts()
      alert(editingProduct ? '✓ Product updated successfully' : '✓ Product added successfully')
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error saving product:', err)
      alert(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'price', 
      label: 'Price',
      render: (item) => `৳${(item.price || 0).toLocaleString()}`
    },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          (item.stock || 0) > 30 
            ? 'bg-green-500/20 text-green-400'
            : (item.stock || 0) > 10
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {item.stock} units
        </span>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-300'
        }`}>
          {item.isActive ? '✓ Active' : 'Disabled'}
        </span>
      )
    }
  ]

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white">📦 Product Management</h1>
            <p className="text-gray-400 text-sm mt-2">Add, edit, and manage your product catalog (live from database)</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-3 rounded-xl font-bold transition duration-300 shadow-lg"
          >
            + Add Product
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}
        <DataTable
          columns={columns}
          data={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          loading={loading}
          emptyMessage="No products found. Click 'Add Product' to create one."
        />
      </main>

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition duration-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition duration-300"
            >
              <option value="">Select Category</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Price (৳) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition duration-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows="4"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition duration-300 resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Image URL</label>
            <input
              type="text"
              value={formData.imageURL}
              onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
              placeholder="https://..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition duration-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveProduct}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition duration-300"
            >
              {saving ? 'Saving...' : `✓ ${editingProduct ? 'Update' : 'Create'} Product`}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductManagement
