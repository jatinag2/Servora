import { Typography } from "@mui/material";
import SignUpForm from "../components/SignUpForm";
import LogoAnimation from "../components/LogoAnimation";
const Signup = () => {
  return (
    <div className="w-[80%] flex flex-row mx-auto mt-1">
      {/*signup form */}
      <div className="flex flex-col gap-3 w-[50%]">
        <div>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Sign <span className="text-yellow-300">Up</span>
          </Typography>
          <p className="text-gray-200 mt-3">
            Fill the form below to create your account
          </p>
        </div>

        <div>
          <SignUpForm />
        </div>
      </div>

      {/** signup animation */}

      <div className="w-[50%] flex items-center justify-center h-[calc(100vh-60px)] ">
        <LogoAnimation />
      </div>
    </div>
  );
};

export default Signup;
