import TextField from "@mui/material/TextField";
import { Button, InputAdornment, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { signUpMailApiCall } from "../services/signup";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import axios from "axios";
const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [loading, setloading] = useState(false);
  const [showpass, setshowpass] = useState(false);
  const [showconfirmpass, setshowconfirmpass] = useState(false);
  const navigate = useNavigate();
  const setRoleHandle = (data: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        role: data,
      };
    });
  };

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
    if (formData.password.length < 8) {
      toast.error("password is to short");
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("password and confirm password not matched");
    }
    const toastloading = toast.loading("sending mail");
    try {
      const response = await signUpMailApiCall(formData);
      toast.dismiss(toastloading);
      toast.success(response.data?.message);
      setloading(false);
      navigate("/verify-otp", { state: formData });
    } catch (error: unknown) {
      setloading(false);
      toast.dismiss(toastloading);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-md p-2 text-black flex flex-col items-center justify-center mt-8">
      <form className=" flex flex-col gap-2 w-full " onSubmit={submitHandler}>
        <TextField
          type="text"
          fullWidth
          variant="filled"
          placeholder="Full Name"
          required
          size="medium"
          name="fullName"
          value={formData.fullName}
          onChange={onChangeHandler}
        />
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

        <TextField
          type={showconfirmpass ? "text" : "password"}
          fullWidth
          variant="filled"
          placeholder="Confirm Password"
          required
          size="medium"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChangeHandler}
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
        <div className="bg-gray-600 flex gap-4 px-6 py-2 rounded-full w-fit">
          <p
            className={`${formData.role === "User" ? "bg-gray-100" : ""} px-6 py-2 rounded-full cursor-pointer`}
            onClick={() => setRoleHandle("User")}
          >
            {" "}
            User
          </p>
          <p
            className={`${formData.role === "Worker" ? "bg-gray-100" : ""} px-6 py-2 rounded-full cursor-pointer`}
            onClick={() => setRoleHandle("Worker")}
          >
            Worker
          </p>
        </div>
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          size="large"
        >
          Sign Up
        </Button>
      </form>

      <div className="flex items-center gap-1 mt-4">
        <p>Already have an account</p>
        <Link to={"/login"} className="text-blue-300">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
