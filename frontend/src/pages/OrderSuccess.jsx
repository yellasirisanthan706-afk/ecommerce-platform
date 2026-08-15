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
            User ID: {order.user_id}
          </p>

          <p>
            Shipping Address: {order.shipping_address}
          </p>

          <p>
            Status: {order.status}
          </p>

          <h2>
            Total: ${Number(order.total_amount).toFixed(2)}
          </h2>

          <h3>Items</h3>

          {order.items &&
            order.items.map((item) => (
              <div key={item.product_id}>
                <p>
                  {item.name} × {item.quantity}
                </p>

                <p>
                  Price: ${Number(item.price).toFixed(2)}
                </p>
              </div>
            ))}
        </div>
      )}

      <Link to="/orders">
        <button type="button">
          View My Orders
        </button>
      </Link>

      <br />
      <br />

      <Link to="/products">
        <button type="button">
          Continue Shopping
        </button>
      </Link>
    </main>
  )
}

export default OrderSuccess