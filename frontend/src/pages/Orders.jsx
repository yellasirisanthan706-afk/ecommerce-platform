import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setError('Please login to view your orders.')
      setLoading(false)
      return
    }

    fetch(
      `http://localhost:5000/api/orders/${userId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        return response.json()
      })
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError('Unable to load your orders.')
        setLoading(false)
      })
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