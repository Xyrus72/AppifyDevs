import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home/Home";
import SignIn from "../pages/Auth/SignIn";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import CustomerDashboard from "../pages/Dashboard/CustomerDashboard";
import Products from "../pages/Products/Products";
import Checkout from "../pages/Checkout/Checkout";
import ProtectedRoute from "../components/ProtectedRoute";

// Admin Pages
import {
  AdminDashboardEnhanced,
  ProductManagement,
  OrderManagement,
  CustomerInsights
} from "../pages/Admin";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [ 
      {
        index: true,
        Component: Home
      },
      {
        path: "signin",
        Component: SignIn
      },
      {
        path: "register",
        Component: Register
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "admin-dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "customer-dashboard",
        element: (
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "products",
        element: (
          <ProtectedRoute requiredRole="customer">
            <Products />
          </ProtectedRoute>
        )
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute requiredRole="customer">
            <Checkout />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardEnhanced />
          </ProtectedRoute>
        )
      },
      {
        path: "products",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ProductManagement />
          </ProtectedRoute>
        )
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute requiredRole="admin">
            <OrderManagement />
          </ProtectedRoute>
        )
      },
      {
        path: "customers",
        element: (
          <ProtectedRoute requiredRole="admin">
            <CustomerInsights />
          </ProtectedRoute>
        )
      }
    ]
  }
]);