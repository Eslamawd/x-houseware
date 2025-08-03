import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "sonner";
import { addOrder } from "../lib/orderApi";

function Checkout() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    location: "",
  });

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async () => {
    if (!formData.username || !formData.phone || !formData.location) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      console.log(cart);
      const response = await addOrder({
        ...formData,
        cart: cart.map((e) => {
          return { product_id: e.id, quantity: e.quantity };
        }),
        total: totalPrice,
      });
      console.log(response);
      clearCart();
      setFormData({
        username: "",
        phone: "",
        location: "",
      });
      toast.success("Order Successfully!");
    } catch (error) {
      toast.error("Failed to Pleace order");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left - Cart items */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="border p-4 rounded-2xl shadow flex items-center gap-2"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>Price: {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="red-button h-10 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right - Checkout form */}
      <div className="bg-green-100 p-6 rounded-4xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Checkout Details</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <textarea
            name="location"
            placeholder="Delivery Address"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          ></textarea>

          <div className="text-right font-bold text-lg">
            Total: ${totalPrice.toFixed(2)}
          </div>

          <button
            onClick={handleOrderSubmit}
            className="w-full bg-green-600 text-white py-2 rounded-4xl hover:bg-green-700"
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
