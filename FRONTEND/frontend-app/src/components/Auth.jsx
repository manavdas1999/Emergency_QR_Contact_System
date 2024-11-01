// src/components/Auth.jsx

import React, { useState } from "react";
import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
  microsoftProvider,
  signInWithPhoneNumber,
} from "../firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
} from "firebase/auth";
import { countryCodes } from "../utils/countryCodes"; // Import country codes

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneCode, setPhoneCode] = useState("+91"); // Default to India
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setIsOtpSent(false);
    setError("");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validatePhone = (phone) => /^\d{10}$/.test(phone); // Adjust based on the expected phone number length
  const validateOtp = (otp) => otp.length === 6;

  const signInWithProvider = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      clearFields();
      alert(`Logged in with ${provider.providerId}`);
    } catch (error) {
      console.error(`Sign-in error with ${provider.providerId}:`, error);
      setError("Error signing in with provider. Please try again.");
    }
  };

  const handleEmailSignUp = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      clearFields();
      alert("Account created successfully!");
    } catch (error) {
      console.error("Email signup error:", error);
      setError("Error creating account. Please try again.");
    }
  };

  const handleEmailLogin = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      clearFields();
      alert("Logged in with email!");
    } catch (error) {
      console.error("Email login error:", error);
      setError("Invalid email or password.");
    }
  };

  const handlePhoneLogin = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
      "recaptcha-container",
      { size: "normal" },
    );
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `${phoneCode}${phone}`, // Combine country code and phone number
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      alert("OTP sent to your phone!");
      clearFields();
    } catch (error) {
      console.error("Phone login error:", error);
      setError("Error sending OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (!validateOtp(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(otp);
      clearFields();
      alert("Phone login successful!");
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign in / Sign up</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Email Sign-In */}
      <div>
        <h3>Email Sign-In</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleEmailSignUp}>Sign Up with Email</button>
        <button onClick={handleEmailLogin}>Login with Email</button>
      </div>

      {/* Phone Sign-In */}
      <div>
        <h3>Phone Sign-In</h3>
        <select onChange={(e) => setPhoneCode(e.target.value)} value={phoneCode}>
          {countryCodes.map((country, index) => (
            <option key={index} value={country.code}>
              {country.name} ({country.code})
            </option>
          ))}
        </select>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handlePhoneLogin}>Send OTP</button>
        <div id="recaptcha-container"></div>

        {isOtpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}
      </div>

      {/* Social Sign-In */}
      <div>
        <h3>Social Sign-In</h3>
        <button onClick={() => signInWithProvider(googleProvider)}>
          Sign in with Google
        </button>
        <button onClick={() => signInWithProvider(facebookProvider)}>
          Sign in with Facebook
        </button>
        <button onClick={() => signInWithProvider(twitterProvider)}>
          Sign in with Twitter
        </button>
        <button onClick={() => signInWithProvider(microsoftProvider)}>
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
};

export default Auth;
