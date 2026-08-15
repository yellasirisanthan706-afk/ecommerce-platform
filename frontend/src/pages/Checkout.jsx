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
  const [loading, setLoading] = useState(false)

  const totalPrice = cart.reduce(
    (total, product) =>
      total + Number(product.price) * product.quantity,
    0
  )

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')

    if (!name || !email || !address) {
      setMessage('Please fill in all fields.')
      return
    }

    if (cart.length === 0) {
      setMessage('Your cart is empty.')
      return
    }

    const userId = localStorage.getItem('userId')

    if (!userId) {
      setMessage('Please login before placing an order.')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        user_id: Number(userId),
        shipping_address: address,
        items: cart.map((product) => ({
          product_id: product.id,
          quantity: product.quantity,
        })),
      }

      const response = await fetch(
        'http://localhost:5000/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Failed to place order.')
        return
      }

      localStorage.setItem(
        'lastOrder',
        JSON.stringify(data.order)
      )

      clearCart()

      navigate('/order-success')
    } catch (error) {
      console.error(error)
      setMessage(
        'Unable to connect to the backend server.'
      )
    } finally {
      setLoading(false)
    }
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
              Number(product.price) * product.quantity
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

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  )
}

export default Checkout