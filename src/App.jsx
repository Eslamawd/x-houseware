import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import NotFound from "./Pages/NotFound";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AdminPanel from "./Pages/AdminPanal";
import Checkout from "./Pages/Checkout";
import Payment from "./Pages/Payment";
import UserRoute from "./components/UserRoute";
import Categories from "./Pages/Categories";
import CategoriesDetail from "./Pages/CategoriesDetail";

import ProductDetail from "./Pages/ProductDetail";
import MainLayout from "./components/MainLayout";
import ProductsPage from "./Pages/ProductsPage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route
                    path="/categories/:id"
                    element={<CategoriesDetail />}
                  />
                  <Route path="/categories/" element={<Categories />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/admin/*" element={<AdminPanel />} />

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
