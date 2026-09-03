"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { register } from "../api/register";

export function useRegister() {
  return useMutation({
    mutationFn: register,
    onSuccess: () => toast.success("Account created. You can now log in."),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to register");
    },
  });
}
