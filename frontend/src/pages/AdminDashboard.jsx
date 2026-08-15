import { useEffect, useState } from 'react'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [creating, setCreating] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  async function fetchProducts() {
    setLoadingProducts(true)

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
        error.message ||
        'Unable to load products.'
      )
    } finally {
      setLoadingProducts(false)
    }
  }

  async function fetchOrders() {
    setLoadingOrders(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/orders'
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to load orders'
        )
      }

      setOrders(data)
    } catch (error) {
      console.error(error)

      setError(
        error.message ||
        'Unable to load orders.'
      )
    } finally {
      setLoadingOrders(false)
    }
  }

  async function createProduct(event) {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!name.trim()) {
      setError('Product name is required.')
      return
    }

    if (!price) {
      setError('Product price is required.')
      return
    }

    if (Number(price) <= 0) {
      setError(
        'Product price must be greater than zero.'
      )
      return
    }

    setCreating(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/products',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            image_url: imageUrl.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to create product'
        )
      }

      setMessage(
        'Product created successfully.'
      )

      setName('')
      setDescription('')
      setPrice('')
      setImageUrl('')

      await fetchProducts()
    } catch (error) {
      console.error(error)

      setError(
        error.message ||
        'Unable to create product.'
      )
    } finally {
      setCreating(false)
    }
  }

  async function deleteProduct(productId) {
    setMessage('')
    setError('')

    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to delete product'
        )
      }

      setMessage(
        'Product deleted successfully.'
      )

      await fetchProducts()
    } catch (error) {
      console.error(error)

      setError(
        error.message ||
        'Unable to delete product.'
      )
    }
  }

  return (
    <main>

      <h1>Admin Dashboard</h1>

      <p>
        Manage products, orders and store information.
      </p>

      {message && (
        <p>
          {message}
        </p>
      )}

      {error && (
        <p>
          {error}
        </p>
      )}

      <hr />

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <h2>Manage Products</h2>

      <h3>Add Product</h3>

      <form onSubmit={createProduct}>

        <div>
          <label>
            Product Name
          </label>

          <br />

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter product name"
          />
        </div>

        <br />

        <div>
          <label>
            Description
          </label>

          <br />

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter product description"
          />
        </div>

        <br />

        <div>
          <label>
            Price
          </label>

          <br />

          <input
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            placeholder="Enter price"
          />
        </div>

        <br />

        <div>
          <label>
            Image URL
          </label>

          <br />

          <input
            type="text"
            value={imageUrl}
            onChange={(event) =>
              setImageUrl(event.target.value)
            }
            placeholder="Enter image URL"
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={creating}
        >
          {creating
            ? 'Creating...'
            : 'Add Product'}
        </button>

      </form>

      <hr />

      <h3>Products</h3>

      {loadingProducts && (
        <p>
          Loading products...
        </p>
      )}

      {!loadingProducts &&
        products.length === 0 && (
          <p>
            No products available.
          </p>
        )}

      {!loadingProducts &&
        products.length > 0 && (
          <div>

            {products.map((product) => (

              <div
                key={product.id}
                className="product-card"
              >

                <h4>
                  {product.name}
                </h4>

                <p>
                  Description: {product.description}
                </p>

                <p>
                  Price: $
                  {Number(
                    product.price
                  ).toFixed(2)}
                </p>

                {product.image_url && (
                  <p>
                    Image: {product.image_url}
                  </p>
                )}

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

      <hr />

      {/* =====================================================
          ORDERS
      ====================================================== */}

      <h2>Customer Orders</h2>

      {loadingOrders && (
        <p>
          Loading orders...
        </p>
      )}

      {!loadingOrders &&
        orders.length === 0 && (
          <p>
            No orders found.
          </p>
        )}

      {!loadingOrders &&
        orders.length > 0 && (

          <div>

            {orders.map((order) => (

              <div
                key={order.id}
                className="order-card"
              >

                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  Customer: {order.user_name}
                </p>

                <p>
                  Email: {order.user_email}
                </p>

                <p>
                  Shipping Address: {order.shipping_address}
                </p>

                <p>
                  Status: {order.status}
                </p>

                <p>
                  Order Date: {order.created_at}
                </p>

                <h4>
                  Items
                </h4>

                {order.items.map((item, index) => (

                  <div
                    key={`${order.id}-${item.product_id}-${index}`}
                  >

                    <p>
                      {item.name}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      Price: $
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </p>

                  </div>

                ))}

                <h4>
                  Total: $
                  {Number(
                    order.total_amount
                  ).toFixed(2)}
                </h4>

              </div>

            ))}

          </div>

        )}

    </main>
  )
}

export default AdminDashboard