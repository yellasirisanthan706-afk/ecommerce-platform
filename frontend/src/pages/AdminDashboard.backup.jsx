import { useEffect, useState } from 'react'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/products'
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to load products'
        )
      }

      setProducts(data)
    } catch (error) {
      console.error(error)

      setError(
        'Unable to load products from the backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  function deleteProduct(productId) {
    setMessage(
      'Delete functionality will be connected to the database in the next step.'
    )
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>
        Manage products and store information.
      </p>

      <h2>Products</h2>

      {loading && (
        <p>Loading products...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading &&
        !error &&
        products.length === 0 && (
          <p>No products available.</p>
        )}

      {!loading &&
        !error &&
        products.length > 0 && (
          <div>
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
              >
                <h3>
                  {product.name}
                </h3>

                <p>
                  Description: {product.description}
                </p>

                <p>
                  Price: $
                  {Number(product.price).toFixed(2)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    deleteProduct(product.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

      {message && (
        <p>{message}</p>
      )}
    </main>
  )
}

export default AdminDashboard