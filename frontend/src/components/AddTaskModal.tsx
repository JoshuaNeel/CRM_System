import React, { useState, useEffect } from 'react'
import { X, Save, Calendar } from 'lucide-react'
import axios from 'axios'

interface Customer {
  id: string
  name: string
  company: string
}

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    customerId: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers')
      setCustomers(response.data.data)
    } catch (err: any) {
      console.error('Failed to fetch customers:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post('/api/tasks', {
        ...formData,
        customerId: formData.customerId || null
      })
      
      onSuccess()
      onClose()
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        customerId: ''
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Add New Task
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Create a new task with all the necessary details
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="input w-full"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input w-full"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input w-full"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input w-full"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer (Optional)
                  </label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    className="input w-full"
                  >
                    <option value="">No Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.company ? `(${customer.company})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button
              type="button"
              disabled={loading}
              className="btn btn-primary inline-flex items-center justify-center w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Task
                </>
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              className="btn btn-secondary inline-flex items-center justify-center w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTaskModal 