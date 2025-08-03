import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosClient"; // Adjust path as needed
import Cookies from "js-cookie";
import cookie from "cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await api().get("/sanctum/csrf-cookie");
        const response = await api().get("/api/user");
        console.log(response);
        setUser(response.data.user);
      } catch (error) {
        console.error("Auth fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isLoggedIn = (reqCookies = null) => {
    if (!reqCookies) {
      return !!Cookies.get("ticket_management_is_user_logged_in");
    }
    return !!cookie.parse(reqCookies).ticket_management_is_user_logged_in;
  };

  const login = async (userData) => {
    if (userData?.name && userData?.email && userData?.role) {
      setUser(userData);
      Cookies.set("ticket_management_user_name", userData.name, {
        expires: 1,
        sameSite: "Lax",
      });
      Cookies.set("ticket_management_is_user_logged_in", true, {
        expires: 1,
        sameSite: "Lax",
      });
    }
    return null;
  };

  const logout = async () => {
    try {
      await api().get("/sanctum/csrf-cookie");
      const response = await api().post("/api/logout"); // Laravel logout route
      if (response.status === 200) {
        setUser(null);
        Cookies.remove("ticket_management_is_user_logged_in");
      }
    } catch (e) {
      console.warn("Logout failed:", e.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggedIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
