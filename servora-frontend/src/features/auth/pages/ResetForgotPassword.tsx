import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import LogoAnimation from "../components/LogoAnimation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { resetForgotPasswordApiCall } from "../services/signup";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
const ResetForgotPassword = () => {
  const [loading, setloading] = useState(false);
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmpassword] = useState("");
  const [showpass, setshowpass] = useState(false);
  const [showconfirmpass, setshowconfirmpass] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const resetToken = location.state;
  const onsubmithandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);

    const toastloading = toast.loading("reseting password");
    try {
      const response = await resetForgotPasswordApiCall({
        password,
        confirmPassword,
        resetToken,
      });
      toast.dismiss(toastloading);
      toast.success(response?.data.message);
      setloading(false);
      navigate("/");
    } catch (error: unknown) {
      setloading(false);
      toast.dismiss(toastloading);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else toast.error("error on reseting forgot password");
    }
  };
  return (
    <div className="w-[80%] flex flex-row mx-auto mt-1">
      <div className="flex flex-col gap-3 w-[50%]">
        <div>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Reset <span className="text-yellow-300">Password</span>
          </Typography>
          <p className="text-gray-200 mt-3">
            Unlock your future with new password
          </p>
        </div>

        <div className="w-full bg-white rounded-md p-2 text-black flex flex-col items-center justify-center mt-35">
          <form
            className=" flex flex-col gap-2 w-full "
            onSubmit={onsubmithandler}
          >
            <TextField
              type={showpass ? "text" : "password"}
              fullWidth
              variant="filled"
              placeholder="New Password"
              required
              size="medium"
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        {showpass ? (
                          <IoMdEye
                            size={22}
                            onClick={() => {
                              setshowpass(false);
                            }}
                          />
                        ) : (
                          <IoMdEyeOff
                            size={22}
                            onClick={() => {
                              setshowpass(true);
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              type={showconfirmpass ? "text" : "password"}
              fullWidth
              variant="filled"
              placeholder="Confirm New Password"
              required
              size="medium"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setconfirmpassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        {showconfirmpass ? (
                          <IoMdEye
                            size={22}
                            onClick={() => {
                              setshowconfirmpass(false);
                            }}
                          />
                        ) : (
                          <IoMdEyeOff
                            size={22}
                            onClick={() => {
                              setshowconfirmpass(true);
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>

      <div className="w-[50%] flex items-center justify-center h-[calc(100vh-60px)] ">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default ResetForgotPassword;
