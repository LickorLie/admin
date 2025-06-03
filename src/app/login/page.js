"use client";

import React, { useRef, useState } from "react";
import supabase  from "../utils/supabase"; // Adjust the import path as necessary
import { use } from "react";
import { useEffect } from "react";

export default function EmailOTPLogin() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputsRef = useRef([]);

useEffect(async () => {
  // look for any existing session or change in auth state
  const session = supabase.auth.getSession();
  if (session) {
    window.location
.href = `${window.location.origin}/dashboard`; // Redirect to dashboard if already logged in
  }
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      window.location.href = `${window.location.origin}/dashboard`; // Redirect to dashboard if logged in
    }
  });
  // get otp from url query params if available
  const urlParams = new URLSearchParams(window.location.search);
  const otp = urlParams.get('otp');
  
  if (otp) {
    console.log("OTP found in query params:", otp);
    setStep(2); // Move to OTP step if otp is present in query params
    inputsRef.current.forEach((input, index) => {
      input.value = otp[index] || ""; // Fill the inputs with the OTP digits
    });
    await supabase.auth.verifyOtp({
      email:"alonzo_zc@hotmail.com",
      token: otp,
      type: "email",
    }).then(() => {
      // Optionally, you can redirect or perform additional actions here
      window.location.href = `${window.location.origin}/dashboard`; // Redirect to dashboard
    });
  }

  return () => {
    subscription.unsubscribe(); // Clean up the subscription on unmount
  }
}, []);

  const handleSendEmailOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`, // or your target page
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setStep(2);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const token = inputsRef.current.map((input) => input.value).join("");
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    }).then(() => {
      // Optionally, you can redirect or perform additional actions here
      window.location.href = `${window.location.origin}/dashboard`; // Redirect to dashboard  
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      alert("Successfully logged in!");
      
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      e.target.value = value;
      if (index < 5) inputsRef.current[index + 1]?.focus();
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1 ? "Login with Email" : "Enter OTP"}
        </h2>

        {error && <p className="text-error mb-2">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleSendEmailOTP} className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col items-center">
            <div className="flex gap-3 mb-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="card w-14 h-16 bg-base-100 shadow-md flex items-center justify-center"
                >
                  <input
                    type="text"
                    maxLength="1"
                    className="input text-center text-xl input-bordered w-10"
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => (inputsRef.current[i] = el)}
                    required
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
