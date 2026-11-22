"use client";
import { useEffect } from "react";
/* Oude OTP-loginpagina: stuurt door naar de nieuwe login */
export default function OldLogin() {
  useEffect(() => { window.location.replace("/"); }, []);
  return null;
}
