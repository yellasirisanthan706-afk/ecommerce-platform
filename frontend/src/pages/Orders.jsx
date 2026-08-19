import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      const userId = localStorage.getItem('userId')
      const accessToken = localStorage.getItem('accessToken')

      if (!userId || !accessToken) {
        setError('Please login to view your orders.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/orders/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.msg ||
              data.error ||
              'Failed to fetch orders'
          )
        }

        setOrders(data)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setError('Unable to load your orders.')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <main>
        <h1>My Orders</h1>
        <p>Loading orders...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>My Orders</h1>
        <p>{error}</p>

        <Link to="/products">
          <button type="button">
            Start Shopping
          </button>
        </Link>
      </main>
    )
  }

  return (
    <main>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div>
          <p>You have no orders yet.</p>

          <Link to="/products">
            <button type="button">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >
              <h2>
                Order #{order.id}
              </h2>

              <p>
                Total: $
                {Number(order.total_amount).toFixed(2)}
              </p>

              <p>
                Status: {order.status}
              </p>

              <p>
                Shipping Address:{' '}
                {order.shipping_address}
              </p>

              <h3>Products</h3>

              {order.items &&
                order.items.map((product) => (
                  <p
                    key={`${order.id}-${product.product_id}`}
                  >
                    {product.name} × {product.quantity}
                  </p>
                ))}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Orders
