import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Search, Calendar, Clock, Edit, CheckCircle } from 'lucide-react'
import AddTaskModal from '../components/AddTaskModal'
import EditTaskModal from '../components/EditTaskModal'
import ConfirmationModal from '../components/ConfirmationModal'

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: string
  status: string
  customer?: {
    id: string
    name: string
    company: string
  }
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Loading states
  const [completingTask, setCompletingTask] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/tasks')
      setTasks(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddSuccess = () => {
    fetchTasks()
    setSuccessMessage('Task created successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleEditSuccess = () => {
    fetchTasks()
    setSuccessMessage('Task updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleCompleteTask = async () => {
    if (!selectedTask) return

    setCompletingTask(selectedTask.id)
    try {
      await axios.put(`/api/tasks/${selectedTask.id}`, {
        ...selectedTask,
        status: 'COMPLETED'
      })
      
      fetchTasks()
      setSuccessMessage('Task marked as completed!')
      setTimeout(() => setSuccessMessage(''), 3000)
      setShowCompleteModal(false)
      setSelectedTask(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete task')
    } finally {
      setCompletingTask(null)
    }
  }

  const openEditModal = (task: Task) => {
    setSelectedTask(task)
    setShowEditModal(true)
  }

  const openCompleteModal = (task: Task) => {
    setSelectedTask(task)
    setShowCompleteModal(true)
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
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and follow-ups</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            {task.description && (
              <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="h-4 w-4" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>

            {task.customer && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Clock className="h-4 w-4" />
                <span>{task.customer.name}</span>
                {task.customer.company && (
                  <span className="text-gray-400">• {task.customer.company}</span>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button 
                onClick={() => openEditModal(task)}
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </button>
              {task.status !== 'COMPLETED' && (
                <button 
                  onClick={() => openCompleteModal(task)}
                  disabled={completingTask === task.id}
                  className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completingTask === task.id ? (
                    <div className="h-3 w-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTask(null)
        }}
        onSuccess={handleEditSuccess}
        task={selectedTask}
      />

      {/* Complete Task Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false)
          setSelectedTask(null)
        }}
        onConfirm={handleCompleteTask}
        title="Complete Task"
        message={`Are you sure you want to mark "${selectedTask?.title}" as completed?`}
        confirmText="Complete Task"
        cancelText="Cancel"
        variant="info"
        loading={completingTask === selectedTask?.id}
      />
    </div>
  )
}

export default Tasks 