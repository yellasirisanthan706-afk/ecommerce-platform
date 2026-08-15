import { Link } from 'react-router-dom'

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-brand"
        >
          E-Commerce
        </Link>

        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          {isLoggedIn && (
            <Link to="/orders">
              My Orders
            </Link>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="logout-button"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar