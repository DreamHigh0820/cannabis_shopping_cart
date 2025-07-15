"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: string // Use product _id (ObjectId as string)
  name: string
  category: string
  price: number // This will be the effective price (QP price for QP products, regular price for lb products)
  quantity: number
  image: string
  isQP?: boolean
  qpPrice?: number
  unit?: string // 'QP' or 'lb'
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  shippingCarrier: "ups" | "usps" | null
  shippingSpeed: "ground" | "2-day" | "overnight" | "priority" | "express" | null
  paymentMethod: string | null
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "SET_SHIPPING_CARRIER"; payload: "ups" | "usps" }
  | { type: "SET_SHIPPING_SPEED"; payload: "ground" | "2-day" | "overnight" | "priority" | "express" }
  | { type: "SET_PAYMENT_METHOD"; payload: string }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      let newItems: CartItem[]
      
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id 
            ? { ...item, quantity: item.quantity + action.payload.quantity } 
            : item,
        )
      } else {
        newItems = [...state.items, action.payload]
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => {
        // Use the price field which now contains the effective price
        return sum + item.price * item.quantity
      }, 0)
      
      return { ...state, items: newItems, totalItems, totalPrice }
    }
    
    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) => 
          item.id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        )
        .filter((item) => item.quantity > 0) // Remove if quantity is 0
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
      
      return { ...state, items: newItems, totalItems, totalPrice }
    }
    
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload.id)
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
      
      return { ...state, items: newItems, totalItems, totalPrice }
    }
    
    case "CLEAR_CART": {
      return { ...state, items: [], totalItems: 0, totalPrice: 0 }
    }
    
    case "LOAD_CART": {
      return action.payload
    }
    
    case "SET_SHIPPING_CARRIER": {
      return { ...state, shippingCarrier: action.payload }
    }
    
    case "SET_SHIPPING_SPEED": {
      return { ...state, shippingSpeed: action.payload }
    }
    
    case "SET_PAYMENT_METHOD": {
      return { ...state, paymentMethod: action.payload }
    }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  shippingCarrier: "ups",
  shippingSpeed: "ground",
  paymentMethod: "BTC",
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("doughboy-cart-v2")
    if (savedCart) {
      try {
        const cartState = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartState })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("doughboy-cart-v2", JSON.stringify(state))
  }, [state])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}