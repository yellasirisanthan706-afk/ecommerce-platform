import { useState } from 'react'

function Wishlist() {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist =
      localStorage.getItem('wishlist')

    return savedWishlist
      ? JSON.parse(savedWishlist)
      : []
  })

  function removeFromWishlist(productId) {
    const updatedWishlist = wishlist.filter(
      (product) => product.id !== productId
    )

    setWishlist(updatedWishlist)

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist)
    )
  }

  return (
    <main>
      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>
          Your wishlist is currently empty.
        </p>
      ) : (
        <div>
          {wishlist.map((product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>

              <p>
                ${product.price.toFixed(2)}
              </p>

              <button
                type="button"
                onClick={() =>
                  removeFromWishlist(product.id)
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Wishlist