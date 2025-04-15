import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartItems: { [productId: number]: number };
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<{ [productId: number]: number }>({});
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        setTotalItems(calculateTotalItems(parsedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setTotalItems(calculateTotalItems(cartItems));
  }, [cartItems]);

  function calculateTotalItems(cart: { [productId: number]: number }) {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  }

  const addToCart = (productId: number, quantity = 1) => {
    setCartItems(prevItems => {
      const currentQuantity = prevItems[productId] || 0;
      return {
        ...prevItems,
        [productId]: currentQuantity + quantity
      };
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const newItems = { ...prevItems };
      delete newItems[productId];
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => ({
      ...prevItems,
      [productId]: quantity
    }));
  };

  const clearCart = () => {
    setCartItems({});
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
