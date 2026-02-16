import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import SignIn from "../pages/Auth/SignIn";
import Register from "../pages/Auth/Register";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import CustomerDashboard from "../pages/Dashboard/CustomerDashboard";
import ProtectedRoute from "../components/ProtectedRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
        children: [ 
            {
                index: true,
                Component:  Home
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
            }
        ]
  },
]);