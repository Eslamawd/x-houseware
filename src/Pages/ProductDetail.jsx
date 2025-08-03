import React, { useEffect, useState } from "react";
import { addOrder } from "../lib/orderApi";
import { getProduct } from "../lib/productApi";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  Star,
  Loader2,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import ImageSlider from "../components/ImageSlider";
import { toast } from "sonner";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProduct(id);
        setService(res.product);
      } catch (error) {
        toast.error("Failed to load service details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...service, quantity });
    toast.success("Added to cart. Go to checkout?", {
      action: {
        label: "Checkout",
        onClick: () => navigate("/checkout"),
      },
    });
  };

  const totalPrice = service
    ? (quantity * parseFloat(service.price)).toFixed(2)
    : "0.00";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center mt-20">
        <p>Service not found.</p>
        <Button asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Left Side: Images */}
        <div className="flex flex-cols-2 h-full m-0">
          {/* Thumbnail images (static example) */}
          <div className="flex flex-col gap-2 mb-4">
            {service.images?.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt="thumbnail"
                className="w-16 h-16 object-cover rounded border"
              />
            ))}
          </div>

          {/* Main image */}
          <div className="w-3/4 bg--300 flex flex-row justify-center items-start  mt-0">
            <ImageSlider images={service.images} />
          </div>
        </div>

        {/* Right Side: Product Info + Buy Form */}
        <div className="space-y-4 flex flex-col justify-between  text-center items-start">
          <h1 className="text-3xl font-bold">{service.name}</h1>
          <p className="text-xl font-semibold text-primary">${service.price}</p>

          {service.category?.name && (
            <Link
              to={`/categories/${service.category.id}`}
              className=" rounded-4xl bg-blue-100 w-30  transition-colors cursor-pointer hover:bg-green-400 hover:text-gray-50"
            >
              {service.category.name}
            </Link>
          )}

          <p className="text-xl font-semibold text-primary">
            {service.description}
          </p>

          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={18}
                className={
                  idx < Math.floor(service.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-gray-500 text-sm ml-2">
              ({service.reviews})
            </span>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="font-semibold text-lg w-8 text-center">
                {quantity}
              </span>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xl font-bold">
              Total: <span className="text-primary">${totalPrice}</span>
            </p>
          </div>
          <Button className="w-full" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
