import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import ConfirmationModal from '../components/ConfirmationModal'

interface Customer {
  id: string
  secureUrl?: string
  name: string
  email: string
  company: string
  status: string
  createdAt: string
  _count?: {
    contacts: number
    tasks: number
  }
}

const Customers = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    customerId: string
    customerName: string
  }>({
    isOpen: false,
    customerId: '',
    customerName: ''
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/customers')
        setCustomers(response.data.data)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    if (!customer) return false;
    
    const matchesSearch = searchTerm === '' || 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const openDeleteModal = (customerId: string, customerName: string) => {
    setDeleteModal({
      isOpen: true,
      customerId,
      customerName
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      customerId: '',
      customerName: ''
    })
  }

  const handleDelete = async () => {
    setDeleting(deleteModal.customerId)
    setError('')
    setSuccessMessage('')
    
    try {
      await axios.delete(`/api/customers/${deleteModal.customerId}`)
      // Refresh the customers list instead of filtering
      const response = await axios.get('/api/customers')
      setCustomers(response.data.data)
      setSuccessMessage(`Customer "${deleteModal.customerName}" deleted successfully`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
      closeDeleteModal()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete customer')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <button 
          onClick={() => navigate('/customers/add')}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Customers List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer?.id || 'unknown'} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-primary-600"
                        onClick={() => navigate(`/customers/${customer?.id}`)}
                      >
                        {customer?.name || 'Unknown Customer'}
                      </div>
                      <div className="text-sm text-gray-500">{customer?.email || 'No email'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer?.company || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      customer?.status === 'CLOSED' 
                        ? 'bg-green-100 text-green-800'
                        : customer?.status === 'LEAD'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {customer?.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer?._count?.contacts || 0} contacts, {customer?._count?.tasks || 0} tasks
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => navigate(`/customers/${customer?.secureUrl || customer?.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Customer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/customers/${customer?.secureUrl || customer?.id}/edit`)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit Customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(customer?.secureUrl || customer?.id || '', customer?.name || 'Unknown Customer')}
                        disabled={deleting === customer?.id}
                        className={`text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                          deleting === customer?.id ? 'animate-pulse' : ''
                        }`}
                        title="Delete Customer"
                      >
                        {deleting === customer?.id ? (
                          <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteModal.customerName}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        variant="danger"
        loading={deleting === deleteModal.customerId}
      />
    </div>
  )
}

export default Customers 