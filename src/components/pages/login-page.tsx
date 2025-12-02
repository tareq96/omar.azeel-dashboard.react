import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AUTH_TOKEN_KEY } from "@/constants";
import { LoginForm } from "@/components/ui/auth/login-form";
import loginBackground from "../../../assets/images/login-background.avif";
import logoFull from "../../../assets/images/logo-full.png";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      navigate({ to: "/", replace: true });
    }
  }, [navigate]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src={logoFull} alt="Logo" className="h-32" />
          </a>
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginBackground}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPage;
