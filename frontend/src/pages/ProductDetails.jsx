import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/products/' + id)
      .then((response) => {
        if (response.status === 404) {
          throw new Error('Product not found')
        }

        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        return response.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError(error.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main>
        <h1>Product Details</h1>
        <p>Loading product...</p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main>
        <h1>Product Not Found</h1>

        <p>
          {error || 'Product not found'}
        </p>

        <Link to="/products">
          <button type="button">
            Back to Products
          </button>
        </Link>
      </main>
    )
  }

  function handleAddToCart() {
    addToCart(product)
  }

  return (
    <main>
      <h1>{product.name}</h1>

      <h2>
        ${Number(product.price).toFixed(2)}
      </h2>

      <p>
        {product.description}
      </p>

      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          width="300"
        />
      )}

      <br />
      <br />

      <button
        type="button"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      <br />
      <br />

      <Link to="/products">
        Back to Products
      </Link>
    </main>
  )
}

export default ProductDetails
