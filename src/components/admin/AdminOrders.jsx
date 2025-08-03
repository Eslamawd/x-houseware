import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { getAllOrders } from "../../lib/adminApi";
import { Link } from "react-router-dom";
import { updateOrder } from "../../lib/orderApi";
import Pagination from "../Pagination";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateStatusDialog, setShowUpdateStatusDialog] = useState(false);
  const [showProductsDialog, setShowProductsDialog] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    links: [],
  });

  const fetchOrders = async (page) => {
    try {
      setIsLoading(true);
      const res = await getAllOrders(page); // تأكد أن دالة getAllOrders تقبل page
      const data = res.orders?.data || [];

      setOrders(data);
      setPendingOrders(data.filter((o) => o.status === "pending"));
      setCompletedOrders(data.filter((o) => o.status === "completed"));

      setPagination({
        currentPage: res.orders.current_page,
        lastPage: res.orders.last_page,
        total: res.orders.total,
        links: res.orders.links,
      });
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.currentPage);
  }, [pagination.currentPage]);

  const resolveOrder = async (order) => {
    try {
      if (order.status === "pending") {
        await updateOrder(order.id, { status: "completed" });
        toast.success("Order Is Completed");
      }

      fetchOrders(pagination.currentPage);
    } catch (error) {
      toast.error("فشل في تحديث الطلب");
    }
  };

  const displayOrders =
    activeTab === "pending"
      ? pendingOrders
      : activeTab === "completed"
      ? completedOrders
      : orders;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Orders</CardTitle>
            <CardDescription>ALL Orders With User</CardDescription>
          </div>
          {pendingOrders.length > 0 && (
            <Badge variant="destructive" className="flex gap-1">
              <Clock className="h-3 w-3" />
              {pendingOrders.length} Pending Orders
            </Badge>
          )}
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 p-4">
              <TabsTrigger className="m-2" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="m-2" value="pending">
                Pending
              </TabsTrigger>
              <TabsTrigger className="m-2" value="completed">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : displayOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Not Found Order
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Info</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Location</TableHead>

                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          {/* Username */}
                          <TableCell>
                            username: {order.buyer?.username || "Unknown"}
                            <br />
                            phone: {order.buyer?.phone || "Unknown"}
                          </TableCell>

                          {/* Total */}
                          <TableCell>${order.total_price}</TableCell>
                          {/* Status */}
                          <TableCell>
                            <span
                              className={`capitalize px-2 py-1 rounded-full text-white text-xs ${
                                order.status === "pending"
                                  ? "bg-yellow-500"
                                  : order.status === "completed"
                                  ? "bg-green-600"
                                  : "bg-red-500"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>

                          {/* Products */}
                          <TableCell>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowProductsDialog(true);
                              }}
                            >
                              Show Product
                            </Button>
                          </TableCell>

                          {/* Created At */}
                          <TableCell>
                            {new Date(order.created_at).toLocaleString()}
                          </TableCell>
                          {/* Created At */}
                          <TableCell>{order.location}</TableCell>

                          {/* Actions */}
                          <TableCell>
                            {order.status === "completed" ? null : (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowUpdateStatusDialog(true);
                                }}
                              >
                                Update Status
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </TabsContent>
            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              lastPage={pagination.lastPage}
              total={pagination.total}
              label="Orders"
              onPrev={() => fetchOrders(pagination.currentPage - 1)}
              onNext={() => fetchOrders(pagination.currentPage + 1)}
            />
          </Tabs>
        </CardContent>

        <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground flex justify-between">
          <span>All Orders:{pagination.total}</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Processing: {pendingOrders.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Completed: {completedOrders.length}
            </span>
          </div>
        </CardFooter>
      </Card>
      <AlertDialog
        open={showUpdateStatusDialog}
        onOpenChange={setShowUpdateStatusDialog}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Updated Status Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you Updated Order Status"completed"؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resolveOrder(selectedOrder);
                setShowUpdateStatusDialog(false);
              }}
            >
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showProductsDialog}
        onOpenChange={setShowProductsDialog}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Title Order Products</AlertDialogTitle>
            <AlertDialogDescription>
              Products with User:
              <strong>{selectedOrder?.buyer?.username}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {selectedOrder?.items?.map((item, idx) => (
              <Link to={`/product/${item.product.id}`} key={idx}>
                {" "}
                <div className="flex justify-between">
                  <span>{item.product.name}</span>
                  <img className="w-18 h-18" src={item.product.images[0]} />
                  <span className="text-sm text-muted-foreground">
                    quantity: {item.quantity}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { AdminOrders };
