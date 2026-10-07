"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authQueryKeys } from "./queryKeys";
import { useAuthStore } from "@/store/useAuthStore";
import { logout } from "@/api/auth";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  return async () => {
    try {
      await logout();
    } finally {
      clearUser();
      queryClient.clear;
      router.replace("/login");
    }
  };
}
