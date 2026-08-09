import React, { useState } from "react";
import LogoAnimation from "../components/LogoAnimation";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import { signUpApiCall, signUpMailApiCall } from "../services/signup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../../authSlice";
const VerifyOtp = () => {
  const [otp, setotp] = useState("");
  const location = useLocation();
  const data = location.state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupdata = {
    ...data,
    otp: otp,
  };
  const [loading, setloading] = useState(false);

  const submitHandler = async () => {
    if (otp.length < 4) {
      toast.error("please fill the otp");
      return;
    }
    const toastid = toast.loading("verifying otp....");

    try {
      setloading(true);
      const response = await signUpApiCall(signupdata);
      dispatch(setToken(response.data?.data?.accessToken));

      setloading(false);
      toast.dismiss(toastid);
      toast.success(response?.data?.message);
      navigate("/");
    } catch (error: any) {
      setloading(false);
      toast.dismiss(toastid);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  const onresendsubmitHandler = async () => {
    const toastid = toast.loading("sending otp....");

    try {
      const response = await signUpMailApiCall(data);
      toast.dismiss(toastid);
      toast.success("signup mail send");
    } catch (error: unknown) {
      toast.dismiss(toastid);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  return (
    <div className="w-[80%] flex flex-row mx-auto mt-1 items-center justify-center h-[calc(100vh-60px)]">
      {/*signup form */}
      <div className=" w-[50%] flex flex-col gap-1 items-center justify-center">
        <div className="flex flex-col gap-1 justify-center items-center">
          <p className="font-semibold text-2xl">We sent you a code</p>
          <p className="font-semibold ">
            Please enter it below to verify your email
          </p>
          <p className="text-blue-700">{data.email}</p>
        </div>
        <div className="flex flex-col gap-1 justify-center items-center">
          <OtpInput
            value={otp}
            onChange={setotp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => (
              <input
                {...props}
                className="w-20 h-12 text-3xl bg-gray-300 border-gray-400 rounded-md text-black"
              />
            )}
          />
          <Button
            disabled={loading}
            variant="contained"
            sx={{ marginTop: "32px", width: "400px" }}
            size="large"
            onClick={submitHandler}
          >
            Verify OTP
          </Button>
        </div>

        <div className="flex flex-row gap-1 justify-center items-center mt-2">
          <p>Don't get the code?</p>
          <p
            className="underline cursor-pointer"
            onClick={onresendsubmitHandler}
          >
            Resend code
          </p>
        </div>
      </div>

      {/** signup animation */}

      <div className="w-[50%] flex items-center justify-center h-[calc(100vh-60px)] ">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default VerifyOtp;
