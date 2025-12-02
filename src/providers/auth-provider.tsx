import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_TOKEN_KEY } from "@/constants";
import {
  useAuthGetProfile,
  useAuthLogin,
  getAuthGetProfileQueryKey,
} from "@/services/api/generated/auth/auth";

export type SignInParams = { identifier: string; password: string };

type User = Record<string, unknown> | null;

type AuthContextType = {
  isLoaded: boolean;
  isAuthenticated: boolean;
  isSigneInLoading: boolean;
  user: User;
  signIn: (params: SignInParams) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isLoaded, setIsLoaded] = useState(false);

  const apiToken =
    typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;

  const {
    data: me,
    isPending: meLoading,
    isError,
    isSuccess,
  } = useAuthGetProfile({
    query: {
      enabled: !!apiToken,
      retry: false,
    },
  });

  // try to normalize typical API shapes
  const user: User = useMemo(() => {
    const root = me as any;
    if (!root) return null;
    if (root.user) return root.user as User;
    if (root.data?.user) return root.data.user as User;
    return root as User;
  }, [me]);

  const isAuthenticated = !!apiToken && !!user;

  const queryClient = useQueryClient();
  const { mutateAsync: login, isPending: isSigneInLoading } = useAuthLogin();

  const signIn = async ({ identifier, password }: SignInParams) => {
    if (!identifier || !password) {
      throw new Error("Invalid credentials");
    }
    const res = (await login({
      data: {
        email: identifier,
        password,
      } as any,
    })) as unknown as any;

    // Accept a few common token shapes
    const token: string | undefined =
      res?.api_token ||
      res?.token ||
      res?.access_token ||
      res?.data?.api_token ||
      res?.data?.token ||
      res?.data?.access_token;
    if (!token) {
      throw new Error("Login succeeded but no token found in response");
    }

    window.localStorage.setItem(AUTH_TOKEN_KEY, token);

    // Refresh profile
    await queryClient.invalidateQueries({
      queryKey: getAuthGetProfileQueryKey() as unknown as any,
    });
    forceUpdate();
  };

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    await queryClient.clear();
    forceUpdate();
  }, [queryClient]);

  useEffect(() => {
    if (isLoaded) return;
    // Consider loaded once profile finished or is not enabled
    const isEnabled = !!apiToken;
    if (!isEnabled || isError || isSuccess) {
      setIsLoaded(true);
    }
  }, [apiToken, isSuccess, isError, isLoaded]);

  const value: AuthContextType = {
    isLoaded,
    isAuthenticated,
    isSigneInLoading: isSigneInLoading || (!!apiToken && meLoading),
    user,
    signIn,
    signOut,
  };

  if (!isLoaded) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
