import { Link } from 'react-router-dom'

function OrderSuccess() {
  const savedOrder = localStorage.getItem('lastOrder')

  const order = savedOrder
    ? JSON.parse(savedOrder)
    : null

  return (
    <main>
      <h1>Order Placed Successfully!</h1>

      <p>
        Thank you for your purchase.
      </p>

      {order && (
        <div>
          <h2>Order Details</h2>

          <p>
            Order ID: {order.id}
          </p>

          <p>
            Name: {order.name}
          </p>

          <p>
            Email: {order.email}
          </p>

          <h2>
            Total: ${order.total.toFixed(2)}
          </h2>
        </div>
      )}

      <Link to="/products">
        <button type="button">
          Continue Shopping
        </button>
      </Link>
    </main>
  )
}

export default OrderSuccess