import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Navbar from "../components/layout/Navbar";
import Signup from "../features/auth/pages/Signup";
import Login from "../features/auth/pages/Login";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import VerifyOtpForgotPassword from "../features/auth/pages/VerifyOtpForgotPassword";
import ResetForgotPassword from "../features/auth/pages/ResetForgotPassword";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Signup />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/verify-otp",
    element: (
      <>
        <Navbar />
        <VerifyOtp />
      </>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <>
        <Navbar />
        <ForgotPassword />
      </>
    ),
  },
  {
    path: "/forgot-password-verify-otp",
    element: (
      <>
        <Navbar />
        <VerifyOtpForgotPassword />
      </>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <>
        <Navbar />
        <ResetForgotPassword />
      </>
    ),
  },
]);
