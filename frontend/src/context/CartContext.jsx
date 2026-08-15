import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  function addToCart(product) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ]
    })
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (product) => product.id !== productId
      )
    )
  }

  function increaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product
      )
    )
  }

  function decreaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart
        .map((product) =>
          product.id === productId
            ? {
                ...product,
                quantity: product.quantity - 1,
              }
            : product
        )
        .filter((product) => product.quantity > 0)
    )
  }

  function clearCart() {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}