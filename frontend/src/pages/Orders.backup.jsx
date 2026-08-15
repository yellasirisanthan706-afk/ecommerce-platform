import { Link } from 'react-router-dom'

function Orders() {
  const savedOrders = localStorage.getItem('orders')

  const orders = savedOrders
    ? JSON.parse(savedOrders)
    : []

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
                Name: {order.name}
              </p>

              <p>
                Email: {order.email}
              </p>

              <p>
                Total: ${order.total.toFixed(2)}
              </p>

              <h3>Products</h3>

              {order.items.map((product) => (
                <p
                  key={`${order.id}-${product.id}`}
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