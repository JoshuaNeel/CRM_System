import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Save, X, Plus, ChevronDown, ChevronRight } from 'lucide-react'

interface CustomerFormData {
  name: string
  email: string
  phone: string
  company: string
  industry: string
  status: string
  source: string
  notes: string
}

interface ContactFormData {
  type: string
  subject: string
  description: string
  date: string
  followUpDate: string
  status: string
}

interface SalesPipelineFormData {
  stage: string
  value: string
  probability: string
  expectedCloseDate: string
  notes: string
}

const AddCustomer = () => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Form sections visibility
  const [showContact, setShowContact] = useState(false)
  const [showPipeline, setShowPipeline] = useState(false)

  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    status: 'LEAD',
    source: '',
    notes: ''
  })

  const [contactData, setContactData] = useState<ContactFormData>({
    type: 'CALL',
    subject: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    followUpDate: '',
    status: 'PLANNED'
  })

  const [pipelineData, setPipelineData] = useState<SalesPipelineFormData>({
    stage: 'LEAD',
    value: '',
    probability: '0',
    expectedCloseDate: '',
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setContactData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePipelineChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPipelineData(prev => ({
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
      // Create customer first
      const customerResponse = await axios.post('/api/customers', formData)
      const customer = customerResponse.data.data
      
      // Create contact if provided
      if (showContact && contactData.subject.trim()) {
        await axios.post('/api/contacts', {
          ...contactData,
          customerId: customer.id
        })
      }

      // Create sales pipeline if provided
      if (showPipeline && pipelineData.stage) {
        await axios.post('/api/pipeline', {
          ...pipelineData,
          customerId: customer.id,
          value: pipelineData.value ? parseFloat(pipelineData.value) : undefined,
          probability: parseInt(pipelineData.probability) || 0
        })
      }

      console.log('Customer created successfully:', customer)
      
      setSuccess(true)
      // Redirect to the main customers page after successful creation
      setTimeout(() => {
        navigate('/customers')
      }, 1000)
    } catch (err: any) {
      console.error('Error creating customer:', err)
      setError(err.response?.data?.error || 'Failed to create customer')
    } finally {
      setSaving(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-gray-600">Create a new customer record with optional contact and pipeline data</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Customer created successfully! Redirecting to customers page...
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input w-full"
                  placeholder="Enter customer's full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input w-full"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="input w-full"
                >
                  <option value="LEAD">Lead</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="CLOSED">Closed</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="e.g., Website, Referral, Cold Call"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="input w-full"
                placeholder="Add any additional notes about this customer..."
              />
            </div>
          </div>

          {/* Initial Contact (Optional) */}
          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setShowContact(!showContact)}
              className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-gray-700"
            >
              {showContact ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <Plus className="h-4 w-4" />
              Add Initial Contact (Optional)
            </button>
            
            {showContact && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactType" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Type
                    </label>
                    <select
                      id="contactType"
                      name="type"
                      value={contactData.type}
                      onChange={handleContactChange}
                      className="input w-full"
                    >
                      <option value="CALL">Phone Call</option>
                      <option value="EMAIL">Email</option>
                      <option value="MEETING">Meeting</option>
                      <option value="DEMO">Demo</option>
                      <option value="FOLLOW_UP">Follow Up</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contactStatus" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="contactStatus"
                      name="status"
                      value={contactData.status}
                      onChange={handleContactChange}
                      className="input w-full"
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contactDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Date
                    </label>
                    <input
                      type="date"
                      id="contactDate"
                      name="date"
                      value={contactData.date}
                      onChange={handleContactChange}
                      className="input w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      id="followUpDate"
                      name="followUpDate"
                      value={contactData.followUpDate}
                      onChange={handleContactChange}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactSubject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="contactSubject"
                    name="subject"
                    value={contactData.subject}
                    onChange={handleContactChange}
                    required={showContact}
                    className="input w-full"
                    placeholder="Brief description of the contact"
                  />
                </div>

                <div>
                  <label htmlFor="contactDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="contactDescription"
                    name="description"
                    value={contactData.description}
                    onChange={handleContactChange}
                    rows={3}
                    className="input w-full"
                    placeholder="Detailed notes about the contact..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sales Pipeline (Optional) */}
          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setShowPipeline(!showPipeline)}
              className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-gray-700"
            >
              {showPipeline ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <Plus className="h-4 w-4" />
              Add Sales Pipeline (Optional)
            </button>
            
            {showPipeline && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pipelineStage" className="block text-sm font-medium text-gray-700 mb-2">
                      Pipeline Stage
                    </label>
                    <select
                      id="pipelineStage"
                      name="stage"
                      value={pipelineData.stage}
                      onChange={handlePipelineChange}
                      className="input w-full"
                    >
                      <option value="LEAD">Lead</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="PROPOSAL">Proposal</option>
                      <option value="NEGOTIATION">Negotiation</option>
                      <option value="CLOSED_WON">Closed Won</option>
                      <option value="CLOSED_LOST">Closed Lost</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pipelineValue" className="block text-sm font-medium text-gray-700 mb-2">
                      Deal Value ($)
                    </label>
                    <input
                      type="number"
                      id="pipelineValue"
                      name="value"
                      value={pipelineData.value}
                      onChange={handlePipelineChange}
                      className="input w-full"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label htmlFor="pipelineProbability" className="block text-sm font-medium text-gray-700 mb-2">
                      Probability (%)
                    </label>
                    <input
                      type="number"
                      id="pipelineProbability"
                      name="probability"
                      value={pipelineData.probability}
                      onChange={handlePipelineChange}
                      className="input w-full"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Close Date
                    </label>
                    <input
                      type="date"
                      id="expectedCloseDate"
                      name="expectedCloseDate"
                      value={pipelineData.expectedCloseDate}
                      onChange={handlePipelineChange}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pipelineNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Pipeline Notes
                  </label>
                  <textarea
                    id="pipelineNotes"
                    name="notes"
                    value={pipelineData.notes}
                    onChange={handlePipelineChange}
                    rows={3}
                    className="input w-full"
                    placeholder="Additional notes about the sales pipeline..."
                  />
                </div>
              </div>
            )}
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
              {saving ? 'Creating...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCustomer 