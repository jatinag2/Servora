import { Typography } from "@mui/material";

import LogoAnimation from "../components/LogoAnimation";
import LoginForm from "../components/LoginForm";
const Login = () => {
  return (
    <div className="w-[80%] flex flex-row mx-auto mt-1">
      {/*signup form */}
      <div className="flex flex-col gap-3 w-[50%] ">
        <div>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Welcome <span className="text-yellow-300">Friends!</span>
          </Typography>
          <p className="text-gray-200 mt-0.5">continue your journey by Login</p>
        </div>

        <div>
          <LoginForm />
        </div>
      </div>

      {/** signup animation */}

      <div className="w-[50%] flex items-center justify-center h-[calc(100vh-60px)] ">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default Login;
