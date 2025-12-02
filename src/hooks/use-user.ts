import { useAuth } from "@/providers/auth-provider";

export function useUser() {
  const { user } = useAuth();
  return user;
}
