import TextField from "@mui/material/TextField";
import { Button, InputAdornment, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { loginApiCall, signUpMailApiCall } from "../services/signup";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../../authSlice";
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setloading] = useState(false);
  const [showpass, setshowpass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);

    const toastloading = toast.loading("sending mail");
    try {
      const response = await loginApiCall(formData);
      toast.dismiss(toastloading);
      toast.success(response.data?.message);
      setloading(false);
      dispatch(setToken(response.data?.data?.accessToken));

      navigate("/");
    } catch (error: unknown) {
      setloading(false);
      toast.dismiss(toastloading);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else toast.error("error on logging");
    }
  };

  return (
    <div className="w-full bg-white rounded-md p-2 text-black flex flex-col items-center justify-center mt-30">
      <form
        className=" flex flex-col gap-2 w-full p-2 "
        onSubmit={submitHandler}
      >
        <TextField
          type="email"
          fullWidth
          variant="filled"
          placeholder="Email"
          required
          size="medium"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
        />

        <TextField
          type={showpass ? "text" : "password"}
          fullWidth
          variant="filled"
          placeholder="Password"
          required
          size="medium"
          name="password"
          value={formData.password}
          onChange={onChangeHandler}
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
        <Link to={"/forgot-password"} className="self-end text-blue-400">
          Forgot Password?
        </Link>

        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>

      <div className="flex items-center gap-1 mt-2">
        <p>Dont't have an account</p>
        <Link to={"/signup"} className="text-blue-300">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
