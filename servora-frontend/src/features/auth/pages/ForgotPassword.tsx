import { Typography } from "@mui/material";
import { Button, TextField } from "@mui/material";
import LogoAnimation from "../components/LogoAnimation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApiCall } from "../services/signup";
const ForgotPassword = () => {
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");

  const navigate = useNavigate();
  const onsubmithandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Fill the  email");
      return;
    }
    setloading(true);

    const toastloading = toast.loading("sending otp mail");
    try {
      const response = await forgotPasswordApiCall(email);
      toast.dismiss(toastloading);
      toast.success(response?.data.message);
      setloading(false);
      navigate("/forgot-password-verify-otp", { state: email });
    } catch (error: unknown) {
      setloading(false);
      toast.dismiss(toastloading);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else toast.error("error on forgot password");
    }
  };
  return (
    <div className="w-[80%] flex flex-row mx-auto mt-1">
      {/*signup form */}
      <div className="flex flex-col gap-3 w-[50%]">
        <div>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Forgot <span className="text-yellow-300">Password</span>
          </Typography>
          <p className="text-gray-200 mt-3">
            Set your new password by verifing mail otp
          </p>
        </div>

        <div className="w-full bg-white rounded-md p-2 text-black flex flex-col items-center justify-center px-3 mt-41">
          <form
            className=" flex flex-col gap-2 w-full "
            onSubmit={onsubmithandler}
          >
            <TextField
              type="email"
              fullWidth
              variant="filled"
              placeholder="Email"
              required
              size="medium"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              sx={{ mt: 1 }}
            />
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2, mb: 1 }}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
      {/** signup animation */}

      <div className="w-[50%] flex items-center justify-center h-[calc(100vh-60px)] ">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default ForgotPassword;
