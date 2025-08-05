import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Save, X } from 'lucide-react'

interface Customer {
  id: string
  secureUrl?: string
  name: string
  email: string
  phone: string
  company: string
  industry: string
  status: string
  source: string
  notes: string
}

const EditCustomer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    status: 'LEAD',
    source: '',
    notes: ''
  })

  useEffect(() => {
    console.log('EditCustomer component mounted with id:', id)
    const fetchCustomer = async () => {
      try {
        console.log('Fetching customer data for id:', id)
        const response = await axios.get(`/api/customers/${id}`)
        const customerData = response.data.data
        console.log('Customer data received:', customerData)
        setCustomer(customerData)
        setFormData({
          name: customerData.name || '',
          email: customerData.email || '',
          phone: customerData.phone || '',
          company: customerData.company || '',
          industry: customerData.industry || '',
          status: customerData.status || 'LEAD',
          source: customerData.source || '',
          notes: customerData.notes || ''
        })
      } catch (err: any) {
        console.error('Error fetching customer:', err)
        setError(err.response?.data?.error || 'Failed to load customer')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCustomer()
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const response = await axios.put(`/api/customers/${id}`, formData)
      console.log('Customer updated successfully:', response.data)
      
      setSuccess(true)
      // Redirect to the main customers page after successful update
      setTimeout(() => {
        navigate('/customers')
      }, 1000)
    } catch (err: any) {
      console.error('Error updating customer:', err)
      setError(err.response?.data?.error || 'Failed to update customer')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !customer) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/customers')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
          <p className="text-gray-600">Update customer information</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Customer updated successfully! Redirecting to customers page...
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="LEAD">Lead</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="CLOSED">Closed</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                placeholder="e.g., Website, Referral, Cold Call"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Additional notes about this customer..."
            />
          </div>

          {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => navigate('/customers')}
                          className="btn btn-secondary inline-flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="btn btn-primary inline-flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
        </form>
      </div>
    </div>
  )
}

export default EditCustomer 