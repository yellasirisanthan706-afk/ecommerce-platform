import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Checkout() {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  const totalPrice = cart.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (!name || !email || !address) {
      setMessage('Please fill in all fields.')
      return
    }

    if (cart.length === 0) {
      setMessage('Your cart is empty.')
      return
    }

    const order = {
      id: Date.now(),
      name,
      email,
      address,
      items: cart,
      total: totalPrice,
      date: new Date().toISOString(),
    }

   const savedOrders = localStorage.getItem('orders')

const orders = savedOrders
  ? JSON.parse(savedOrders)
  : []

orders.push(order)

localStorage.setItem(
  'orders',
  JSON.stringify(orders)
)

localStorage.setItem(
  'lastOrder',
  JSON.stringify(order)
)

    clearCart()

    navigate('/order-success')
  }

  if (cart.length === 0) {
    return (
      <main>
        <h1>Checkout</h1>

        <p>
          Your cart is empty. Please add products before
          checking out.
        </p>

        <Link to="/products">
          <button type="button">
            Go to Products
          </button>
        </Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Checkout</h1>

      <p>Complete your order below.</p>

      <h2>Order Summary</h2>

      {cart.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>

          <p>
            Quantity: {product.quantity}
          </p>

          <p>
            Subtotal: $
            {(
              product.price * product.quantity
            ).toFixed(2)}
          </p>
        </div>
      ))}

      <h2>
        Total: ${totalPrice.toFixed(2)}
      </h2>

      <h2>Customer Information</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your name"
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
          />
        </div>

        <br />

        <div>
          <label>Address</label>
          <br />

          <textarea
            value={address}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            placeholder="Enter your address"
          />
        </div>

        <br />

        <button type="submit">
          Place Order
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  )
}

export default Checkout