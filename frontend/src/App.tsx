import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import EditCustomer from './pages/EditCustomer'
import AddCustomer from './pages/AddCustomer'
import Tasks from './pages/Tasks'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/add" element={<AddCustomer />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="customers/:id/edit" element={<EditCustomer />} />
            <Route path="tasks" element={<Tasks />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App 