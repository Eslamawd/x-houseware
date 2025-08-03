
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { motion } from "framer-motion";
import { Users, ShoppingCart, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { getAllOrdersCount, getRevnueCount,  } from "../../lib/adminApi";


const AdminDashboard = () => {
  const [activeOrders, setActiveOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ activeOrdersResponse, revenueResponse] = await Promise.all([
      
        getAllOrdersCount(),
        getRevnueCount()
      ]);

    

      if (activeOrdersResponse && activeOrdersResponse.count >= 0) {
        setActiveOrders(activeOrdersResponse.count);
      } else {
        setActiveOrders(0);
        toast.error("No active orders found");
      }

      if (revenueResponse && revenueResponse.count >= 0) {
        setRevenue(revenueResponse.count);
      } else {
        setRevenue(0);
        toast.error("No revenue data found");
      }

    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Something went wrong while fetching dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);


  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
     
    );
  }




  
  const orderPercentChange = activeOrders > 0 ? "-12%" : "0%";
  const revenuePercentChange = revenue > 0 ? "+18.2%" : "0%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            Active Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          ) : (
            <motion.div 
              className="text-2xl font-bold"
              key={activeOrders}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {activeOrders}
            </motion.div>
          )}
          <p className="text-xs text-gray-500">{orderPercentChange} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          ) : (
            <motion.div 
              className="text-2xl font-bold"
              key={revenue}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              ${revenue.toLocaleString()}
            </motion.div>
          )}
          <p className="text-xs text-gray-500">{revenuePercentChange} from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
