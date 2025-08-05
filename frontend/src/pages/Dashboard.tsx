import { useState, useEffect } from 'react'
import axios from 'axios'
import { Users, CheckSquare, DollarSign, TrendingUp } from 'lucide-react'

interface DashboardStats {
  customers: {
    total: number
    byStatus: Array<{ status: string; _count: { status: number } }>
  }
  tasks: {
    total: number
    overdue: number
    byStatus: Array<{ status: string; _count: { status: number } }>
  }
  pipeline: {
    byStage: Array<{ stage: string; _count: { stage: number }; _sum: { value: number | null } }>
  }
  recentActivities: {
    contacts: Array<any>
    tasks: Array<any>
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats')
        setStats(response.data.data)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your CRM dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.customers.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tasks.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.pipeline.byStage.reduce((sum, stage) => sum + (stage._sum.value || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tasks.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Contacts</h3>
          <div className="space-y-3">
            {stats.recentActivities.contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{contact.subject}</p>
                  <p className="text-xs text-gray-500">
                    {contact.customer.name} • {new Date(contact.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  contact.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            {stats.recentActivities.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'HIGH' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 