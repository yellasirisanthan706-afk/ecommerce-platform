import { Link } from 'react-router-dom'

const featuredProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 49.99,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 79.99,
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 59.99,
  },
]

function Home() {
  return (
    <main>
      <section>
        <h1>Welcome to Our Store</h1>

        <p>
          Discover amazing products at great prices.
        </p>

        <Link to="/products">
          <button type="button">
            Shop Now
          </button>
        </Link>
      </section>

      <section>
        <h2>Featured Products</h2>

        <div>
          {featuredProducts.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>

              <p>
                ${product.price}
              </p>
            </div>
          ))}
        </div>

        <Link to="/products">
          <button type="button">
            View All Products
          </button>
        </Link>
      </section>
    </main>
  )
}

export default Home