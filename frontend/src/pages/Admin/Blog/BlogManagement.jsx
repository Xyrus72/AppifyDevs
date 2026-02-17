import React, { useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'

/**
 * Blog Management Page
 * Features: Create, Edit, Delete, and View blog posts
 * CRUD functionality for blog content
 */
const BlogManagement = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Summer Collection 2024',
      category: 'Fashion',
      author: 'Admin',
      status: 'Published',
      date: '2024-02-15',
      views: 1250
    },
    {
      id: 2,
      title: 'How to Choose the Right Size',
      category: 'Guide',
      author: 'Admin',
      status: 'Draft',
      date: '2024-02-14',
      views: 340
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    author: 'Admin',
    image: null,
    status: 'Draft'
  })

  const handleAddBlog = () => {
    setEditingBlog(null)
    setFormData({ title: '', category: '', content: '', author: 'Admin', image: null, status: 'Draft' })
    setIsModalOpen(true)
  }

  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      category: blog.category,
      content: '',
      author: blog.author,
      image: null,
      status: blog.status
    })
    setIsModalOpen(true)
  }

  const handleDeleteBlog = (blog) => {
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      setBlogs(blogs.filter(b => b.id !== blog.id))
      alert('✓ Blog deleted successfully')
    }
  }

  const handleSaveBlog = () => {
    if (!formData.title || !formData.category || !formData.content) {
      alert('❌ Please fill in all required fields')
      return
    }

    if (editingBlog) {
      setBlogs(blogs.map(b => 
        b.id === editingBlog.id 
          ? { ...b, ...formData, date: new Date().toISOString().split('T')[0] }
          : b
      ))
      alert('✓ Blog updated successfully')
    } else {
      setBlogs([...blogs, {
        id: Math.max(...blogs.map(b => b.id), 0) + 1,
        ...formData,
        date: new Date().toISOString().split('T')[0],
        views: 0
      }])
      alert('✓ Blog published successfully')
    }
    setIsModalOpen(false)
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
    { 
      key: 'date', 
      label: 'Published Date',
      render: (item) => new Date(item.date).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          item.status === 'Published'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {item.status}
        </span>
      )
    },
    { 
      key: 'views', 
      label: 'Views',
      render: (item) => `👁️ ${item.views.toLocaleString()}`
    }
  ]

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white">📝 Blog Management</h1>
            <p className="text-gray-400 text-sm mt-2">Create and manage blog posts</p>
          </div>
          <button
            onClick={handleAddBlog}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-bold transition duration-300 shadow-lg"
          >
            + New Blog Post
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={blogs}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          emptyMessage="No blog posts found. Click 'New Blog Post' to create one."
        />
      </main>

      {/* Blog Form Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingBlog ? '✏️ Edit Blog Post' : '📝 Write New Blog Post'}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Blog Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter blog title"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition duration-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition duration-300"
            >
              <option value="">Select Category</option>
              <option value="Fashion">Fashion</option>
              <option value="Guide">Guide</option>
              <option value="News">News</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter blog content"
              rows="8"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition duration-300 resize-none"
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition duration-300"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition duration-300"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Featured Image</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition duration-300">
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                accept="image/*"
                className="hidden"
                id="blog-image"
              />
              <label htmlFor="blog-image" className="cursor-pointer">
                <p className="text-gray-400">🖼️ Click to upload featured image</p>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveBlog}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
            >
              ✓ {editingBlog ? 'Update' : 'Publish'} Blog
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

export default BlogManagement
