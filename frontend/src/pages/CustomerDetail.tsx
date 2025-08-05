import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Phone, Mail, Building, Edit, Trash2 } from 'lucide-react'
import ConfirmationModal from '../components/ConfirmationModal'

interface Customer {
  id: string
  secureUrl?: string
  name: string
  email: string
  phone: string
  company: string
  industry: string
  status: string
  notes: string
  contacts: Array<{
    id: string
    type: string
    subject: string
    description: string
    date: string
    status: string
  }>
  salesPipeline?: {
    stage: string
    value: number
    probability: number
    expectedCloseDate: string
  } | Array<{
    stage: string
    value: number
    probability: number
    expectedCloseDate: string
  }>
}

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customers/${id}`)
        setCustomer(response.data.data)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load customer')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [id])

  const handleDelete = async () => {
    if (!customer) return
    
    setDeleting(true)
    try {
      await axios.delete(`/api/customers/${customer.secureUrl || id}`)
      navigate('/customers')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete customer')
    } finally {
      setDeleting(false)
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

  if (!customer) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/customers')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Customer Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/customers/${customer?.secureUrl || id}/edit`)}
            className="btn-primary inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Customer
          </button>
          <button
            onClick={() => setDeleteModal(true)}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {deleting ? 'Deleting...' : 'Delete Customer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{customer.phone || 'No phone'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{customer.company || 'No company'}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <p className="text-sm text-gray-900">{customer.industry || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                customer.status === 'CLOSED' 
                  ? 'bg-green-100 text-green-800'
                  : customer.status === 'LEAD'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {customer.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <p className="text-sm text-gray-900">{customer.notes || 'No notes'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact History */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Contact History</h2>
        {customer.contacts.length > 0 ? (
          <div className="space-y-4">
            {customer.contacts.map((contact) => (
              <div key={contact.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{contact.subject}</h3>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      contact.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contact.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(contact.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No contact history</p>
        )}
      </div>

      {/* Pipeline Info */}
      <div>
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Pipeline</h2>
          {customer.salesPipeline ? (
            <div className="space-y-4">
              {/* Handle both array and object cases */}
              {Array.isArray(customer.salesPipeline) ? (
                customer.salesPipeline.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stage</label>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                        customer.salesPipeline[0].stage === 'CLOSED_WON' 
                          ? 'bg-green-100 text-green-800'
                          : customer.salesPipeline[0].stage === 'CLOSED_LOST'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {customer.salesPipeline[0].stage.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Value</label>
                      <p className="text-sm text-gray-900">${customer.salesPipeline[0].value?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Probability</label>
                      <p className="text-sm text-gray-900">{customer.salesPipeline[0].probability}%</p>
                    </div>
                    {customer.salesPipeline[0].expectedCloseDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expected Close Date</label>
                        <p className="text-sm text-gray-900">
                          {new Date(customer.salesPipeline[0].expectedCloseDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No pipeline information</p>
                )
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stage</label>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      customer.salesPipeline.stage === 'CLOSED_WON' 
                        ? 'bg-green-100 text-green-800'
                        : customer.salesPipeline.stage === 'CLOSED_LOST'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {customer.salesPipeline.stage.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <p className="text-sm text-gray-900">${customer.salesPipeline.value?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Probability</label>
                    <p className="text-sm text-gray-900">{customer.salesPipeline.probability}%</p>
                  </div>
                  {customer.salesPipeline.expectedCloseDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expected Close Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(customer.salesPipeline.expectedCloseDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No pipeline information</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customer.name}"? This action cannot be undone and will permanently remove all associated data including contacts, tasks, and pipeline information.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default CustomerDetail 