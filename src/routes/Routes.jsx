import React from "react";
import { Route, Routes } from "react-router-dom";
import LogIn from "../pages/LogIn/LogIn";
import SignUp from "../pages/Sign Up/SignUp";
import MultiStepForm from "../components/Reusable/Form/MultiStepForm";
import Congratulation from "../components/Modal/Congratulation";
import Wallet from "../pages/Wallet/Wallet";
import Dashboard from "../pages/Dashboard/Dashboard";
import BusManagement from "../pages/Bus-Management/BusManagement";
import DriverManagement from "../pages/Driver-Management/DriverManagement";
import RouteManagement from "../pages/Route-Management/RouteManagement";
import TicketManagement from "../pages/Ticket-Management/TicketManagement";
import AddManageUser from "../pages/Add-Manage-User/AddManageUser";
import CustomerFeedback from "../pages/Customer-Feedback/CustomerFeedback";
import AddBusDetails from "../components/Bus-Management-Content/Add-Bus-Details/AddBusDetails";
import ManageRoutes from "../components/Route-Content/Manage-Routes/ManageRoutes";
import DriverDetails from "../components/Driver-Content/Driver-Details/DriverDetails";
import AddTicket from "../components/Ticket-Content/Add-Ticket/AddTicket";
import UserDetails from "../components/Add-User-Content/User-Management/UserDetails";
import StepOneSummary from "../components/Bus-Management-Content/Add-Bus-Details/Form-Summary/Step-One-Summary/StepOneSummary";
import Profile from "../pages/Profile/Profile";
import PrivateRoute from "../components/Private-Routes/PrivateRoute";
import AddBankDetails from "../components/Add-Bank-Details/AddBankDetails";
import ResetByEmail from "../pages/LogIn/Reset_Password/Reset_By_Email/ResetByEmail";
import UpdatePassword from "../pages/LogIn/Reset_Password/Reset_By_Email/UpdatePassword";
import PublicRoute from "../components/Public-Routes/PublicRoute";
import LayoutNew from "../components/Layout-New/LayoutNew";
import AssignDriver from "../pages/Assign-Driver/AssignDriver";
import EditRouteDetails from "../pages/Route-Management/EditRouteDetails";

import "../App.css";

const publicRoutes = [
  { path: "/", element: <LogIn /> },
  { path: "/reset-password", element: <ResetByEmail /> },
  { path: "/update-password", element: <UpdatePassword /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/step", element: <MultiStepForm /> },
  { path: "/add-bus-details", element: <AddBankDetails /> },
  { path: "/thank-you", element: <Congratulation /> },
];

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<PublicRoute>{element}</PublicRoute>}
        />
      ))}

      {/* Private Routes wrapped with Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <LayoutNew />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bus-management" element={<BusManagement />} />
        <Route path="driver-management" element={<DriverManagement />} />
        <Route path="route-management" element={<RouteManagement />} />
        <Route path="ticket-management" element={<TicketManagement />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="add-manage-user" element={<AddManageUser />} />
        <Route path="feedback" element={<CustomerFeedback />} />
        <Route
          path="bus-management/add-bus-details"
          element={<AddBusDetails />}
        />
        <Route path="bus-management/edit" element={<StepOneSummary />} />
        <Route
          path="route-management/manage-route"
          element={<ManageRoutes />}
        />
        <Route
          path="driver-management/add-driver-details"
          element={<DriverDetails />}
        />
        <Route path="ticket-management/add-ticket" element={<AddTicket />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="add-manage-user/user-management"
          element={<UserDetails />}
        />
        <Route
          path="driver-management/assign-driver/:id"
          element={<AssignDriver />}
        />
        <Route
          path="route-management/edit-route/:id"
          element={<EditRouteDetails />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
