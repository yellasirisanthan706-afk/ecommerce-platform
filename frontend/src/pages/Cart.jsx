import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart()

  const totalPrice = cart.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  )

  return (
    <main>
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div>
          <p>Your cart is currently empty.</p>

          <Link to="/products">
            <button type="button">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {cart.map((product) => (
            <div
              className="cart-item"
              key={product.id}
            >
              <div>
                <h2>{product.name}</h2>

                <p>
                  Price: ${product.price.toFixed(2)}
                </p>

                <p>
                  Subtotal: $
                  {(
                    product.price *
                    product.quantity
                  ).toFixed(2)}
                </p>
              </div>

              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() =>
                    decreaseQuantity(product.id)
                  }
                >
                  -
                </button>

                <span>
                  {product.quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    increaseQuantity(product.id)
                  }
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  removeFromCart(product.id)
                }
              >
                Remove
              </button>
            </div>
          ))}

          <div className="cart-summary">
            <h2>
              Total: ${totalPrice.toFixed(2)}
            </h2>

            <Link to="/products">
              <button type="button">
                Continue Shopping
              </button>
            </Link>

            {' '}

            <Link to="/checkout">
              <button type="button">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

export default Cart