"use client";

import { useMutation } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";

import { getErrorMessage } from "@/lib/error-handler";
import { register } from "../api/register";

export function useRegister() {
  return useMutation({
    mutationFn: register,
    onSuccess: () => toastSuccess("Account created. You can now log in."),
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
