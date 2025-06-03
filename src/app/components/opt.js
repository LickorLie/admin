"use client";

import React, { useEffect } from "react";
import supabase from "../utils/supabase";


export default function OTPInput() {

    var text = "";
// Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
  


  if (event === 'INITIAL_SESSION') {
    // handle initial session

  } else if (event === 'SIGNED_IN') {
    // handle sign in event
    console.log("User signed in:", session.user);
    useRouter().push('/dashboard'); // Redirect to dashboard or another page
    window.location.href = '/dashboard'; // Redirect to dashboard or another page
  } else if (event === 'SIGNED_OUT') {
    // handle sign out event
  } else if (event === 'PASSWORD_RECOVERY') {
    // handle password recovery event
  } else if (event === 'TOKEN_REFRESHED') {
    // handle token refreshed event
  } else if (event === 'USER_UPDATED') {
    // handle user updated event
  }
})
// call unsubscribe to remove the callback
data.subscription.unsubscribe()

useEffect( () => {
      async function fetchData() {

    // Initialize supabase client and login via otp
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        // User is already logged in, redirect or handle accordingly
        console.log("User is already logged in:", user);
        
        text = "User is already logged in";
        window.location.href = '/dashboard'; // Redirect to dashboard or another page
    }else {
        console.log("No user found, proceeding with OTP login");
        text = "No user found, proceeding with OTP login";
        const { data, error } = await supabase.auth.getSession()
    // Check if there's an existing session
    if (data.session) {
        console.log("Session found:", data.session);
        text = "Session found, user is logged in";
    } else{
        const { data, error } = await supabase.auth.signInWithOtp({
        email: "alonzo_zc@hotmail.com",
        options: {
            shouldCreateUser: false, // Set to true if you want to create a user if it doesn't exist
        },
    });
    }

}} fetchData();
}, []);


//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !e.target.value && index > 0) {
//       inputsRef.current[index - 1].focus();
//     }
//   };

const submitOTP = async (e) => {
  e.preventDefault();
  let otp = document.querySelectorAll('input[name="otp"]')
  let otpvalue= [];
    for (let i = 0; i < otp.length; i++) {
      otpvalue.push(otp[i].value);
    }
  console.log("Submitting OTP:", otpvalue.join(''));
  const { error } = await supabase.auth.verifyOtp({
  email: "alonzo_zc@hotmail.com",
  token: otpvalue.join(''),
  type: "email",
  })
  if (error) {
    console.error("Error verifying OTP:", error.message);
  }else {
    console.log("OTP verified successfully");
    window.location.href = '/dashboard'; // Redirect to dashboard or another page
  }
}
      return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-200">
   
    <form className="card w-96 bg-base-100 shadow-xl p-2" onSubmit={submitOTP}>
      <h1 className="text-3xl font-bold mb-4">OTP Login</h1>
      <h2 className="text-lg font-bold mb-6">Enter OTP</h2>
      <div className="flex gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card w-16 h-20 bg-base-100 shadow-md flex items-center justify-center">
            
            <input
              type="text"
              maxLength="1"
              name="otp"
              className="input text-center text-xl input-bordered w-12"
            />
          
          </div>
        ))}
      </div>
        <button className="btn btn-primary mt-2" type="submit" >
              Submit
            </button>
            </form>
    </div>
  );
}
