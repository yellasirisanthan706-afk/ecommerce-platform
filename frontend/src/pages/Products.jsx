import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Products() {
  const { addToCart } = useCart()

  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist')

    if (savedWishlist) {
      return JSON.parse(savedWishlist)
    }

    return []
  })

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        return response.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError('Unable to load products.')
        setLoading(false)
      })
  }, [])

  function addToWishlist(product) {
    const alreadyInWishlist = wishlist.some(
      (item) => item.id === product.id
    )

    if (alreadyInWishlist) {
      return
    }

    const updatedWishlist = [
      ...wishlist,
      product,
    ]

    setWishlist(updatedWishlist)

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist)
    )
  }

  function removeFromWishlist(productId) {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== productId
    )

    setWishlist(updatedWishlist)

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist)
    )
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <main>
        <h1>Products</h1>
        <p>Loading products...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>Products</h1>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Products</h1>

      <p>Browse our products.</p>

      <input
        type="text"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value)
        }}
        placeholder="Search products..."
      />

      <br />
      <br />

      <Link to="/wishlist">
        <button type="button">
          My Wishlist ({wishlist.length})
        </button>
      </Link>

      <br />
      <br />

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const isInWishlist = wishlist.some(
              (item) => item.id === product.id
            )

            return (
              <div
                className="product-card"
                key={product.id}
              >
                <h2>{product.name}</h2>

                <p>
                  Price: {Number(product.price).toFixed(2)}
                </p>

                <Link to={'/products/' + product.id}>
                  <button type="button">
                    View Details
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(product)
                  }}
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isInWishlist) {
                      removeFromWishlist(product.id)
                    } else {
                      addToWishlist(product)
                    }
                  }}
                >
                  {isInWishlist
                    ? 'Remove from Wishlist'
                    : 'Add to Wishlist'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Products