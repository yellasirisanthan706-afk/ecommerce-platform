import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Wishlist from './pages/Wishlist.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Orders from './pages/Orders.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  )

  function handleLogin(email) {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)

    setIsLoggedIn(true)
  }

  function handleLogout() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')

    setIsLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <Login
              isLoggedIn={isLoggedIn}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App