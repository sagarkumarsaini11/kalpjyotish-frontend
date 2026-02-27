// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { IoClose } from "react-icons/io5";
// import { FcGoogle } from "react-icons/fc";
// import { useNavigate } from "react-router-dom";
// import authImage from "../assets/authImage.jpg";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../firebase";
// import "./AuthModal.css";

// // 🔥 Firebase imports
// // import { auth } from "../firebase";
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export default function AuthModal({ onClose, isLoggedIn, user }) {
//   const [step, setStep] = useState("mobile");
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   /* ---------------- REDIRECT IF LOGGED IN ---------------- */
//   useEffect(() => {
//     if (isLoggedIn && user) {
//       onClose();
//       navigate("/user-profile");
//     }
//   }, [isLoggedIn, user, navigate, onClose]);

//   /* ---------------- INIT FIREBASE reCAPTCHA ---------------- */
//   // useEffect(() => {
//   //   if (!window.recaptchaVerifier) {
//   //     window.recaptchaVerifier = new RecaptchaVerifier(
//   //       "recaptcha-container",
//   //       { size: "invisible" },
//   //       auth
//   //     );
//   //   }
//   // }, []);

//   /* ---------------- CHECK USER (BACKEND) ---------------- */
//   const checkUser = async () => {
//     if (mobile.length !== 10) {
//       setError("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     // try {
//     //   const res = await fetch("/auth/check-user", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ mobile }),
//     //   });

//     //   const data = await res.json();

//     //   if (!data.exists) {
//     //     setStep("register");
//     //   } else {
//     //     await sendOtp();
//     //   }
//     // } catch {
//     //   setError("Server error. Try again.");
//     // } finally {
//     //   setLoading(false);
//     // }
//   };

//   /* ---------------- SEND OTP (FIREBASE) ---------------- */
//   const sendOtp = async () => {
//     try {
//       if (mobile.length !== 10) {
//         setError("Please enter valid number");
//         return;
//       }

//       setLoading(true);
//       setError("");

//       await setupRecaptcha();

//       const phoneNumber = `+91${mobile}`;
//       const appVerifier = window.recaptchaVerifier;

//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         phoneNumber,
//         appVerifier
//       );

//       window.confirmationResult = confirmationResult;

//       setMessage("OTP sent successfully");
//       setStep("otp");
//     } catch (err) {
//       console.error("OTP ERROR:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupRecaptcha = async () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         {
//           size: "invisible",
//         }
//       );
//       await window.recaptchaVerifier.render();
//     }
//   };

//   /* ---------------- REGISTER USER (BACKEND) ---------------- */
//   // const registerUser = async () => {
//   //   if (!name.trim()) {
//   //     setError("Please enter your name");
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   // await fetch("/auth/register", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ name, mobile }),
//   //     });

//   //     await sendOtp();
//   //   } catch {
//   //     setError("Registration failed");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const registerUser = async () => {
//     if (!name.trim()) {
//       setError("Please enter your name");
//       return;
//     }
//     await sendOtp();
//   };
//   // ---------------------------------verify otp----------------------

//   const verifyOtp = async () => {
//     try {
//       setLoading(true);

//       const result = await window.confirmationResult.confirm(otp);
//       const firebaseUser = result.user;

//       let backendUser = null;
//       let backendToken = null;
//       try {
//         const backendResp = await fetch(`${API_BASE_URL}/api/otp/verify-otp`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone: mobile, otp: "1234" }),
//         });
//         const backendData = await backendResp.json();
//         if (backendData?.success) {
//           backendUser = backendData?.data?.user || null;
//           backendToken = backendData?.data?.token || null;
//         }
//       } catch {
//         // keep firebase-only session fallback
//       }

//       const sessionUser = {
//         _id: backendUser?._id || null,
//         id: backendUser?._id || firebaseUser.uid,
//         name: backendUser?.name || name?.trim() || "User",
//         mobileNo: backendUser?.mobileNo || mobile,
//         phoneNumber: firebaseUser.phoneNumber,
//       };

//       localStorage.setItem("user", JSON.stringify(sessionUser));
//       if (backendUser?._id) {
//         localStorage.setItem("backendUserId", backendUser._id);
//         localStorage.setItem("userId", backendUser._id);
//       }
//       if (backendToken) {
//         localStorage.setItem("authToken", backendToken);
//       }
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("authRole", "user");

//       onClose();
//       navigate("/user-profile");
//     } catch (err) {
//       console.error(err);
//       alert("Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // --------------------google Login ---------------

//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const result = await signInWithPopup(auth, googleProvider);

//       const firebaseUser = result.user;
//       let backendUser = null;
//       let backendToken = null;
//       try {
//         const backendResp = await fetch(`${API_BASE_URL}/api/auth/social-login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: firebaseUser.email || "",
//             name: firebaseUser.displayName || "Google User",
//             profile: firebaseUser.photoURL || "",
//           }),
//         });
//         const backendData = await backendResp.json();
//         if (backendResp.ok && backendData?.data) {
//           backendUser = backendData.data;
//           backendToken = backendData.token || null;
//         }
//       } catch {
//         // fallback to firebase session only
//       }

//       const sessionUser = {
//         _id: backendUser?._id || null,
//         id: backendUser?._id || firebaseUser.uid,
//         name: backendUser?.name || firebaseUser.displayName || "Google User",
//         email: backendUser?.email || firebaseUser.email || "",
//         profileImage: backendUser?.profile || firebaseUser.photoURL || "",
//       };
//       localStorage.setItem("user", JSON.stringify(sessionUser));
//       if (backendUser?._id) {
//         localStorage.setItem("backendUserId", backendUser._id);
//         localStorage.setItem("userId", backendUser._id);
//       }
//       if (backendToken) {
//         localStorage.setItem("authToken", backendToken);
//       }
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("authRole", "user");

//       onClose();
//       navigate("/user-profile");
//     } catch (err) {
//       console.error(err);
//       setError("Google sign-in failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- OTHER HANDLERS ---------------- */
//   // const handleGoogleLogin = () => {
//   //   window.location.href = "/auth/google";
//   // };

//   const handleAstrologerLogin = () => {
//     onClose();
//     navigate("/astrologer-login");
//   };

//   const handleBackdropClick = (e) => {
//     if (e.target.classList.contains("auth-backdrop")) {
//       onClose();
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="auth-backdrop" onClick={handleBackdropClick}>
//       <motion.div
//         className="auth-modal"
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button className="auth-close" onClick={onClose}>
//           <IoClose />
//         </button>

//         {/* LEFT */}
//         <div className="auth-left">
//           <img src={authImage} alt="Auth" />
//         </div>

//         {/* RIGHT */}
//         <div className="auth-right">
//           {error && <p className="error-text">{error}</p>}
//           {message && <p className="info-text">{message}</p>}

//           {step === "mobile" && (
//             <>
//               <h2>Log In</h2>
//               <p className="subtitle">Enter your mobile number to continue</p>

//               <input
//                 type="tel"
//                 placeholder="Mobile Number"
//                 value={mobile}
//                 maxLength="10"
//                 onChange={(e) => {
//                   setMobile(e.target.value.replace(/\D/g, ""));
//                   setError("");
//                 }}
//               />

//               <button
//                 disabled={mobile.length !== 10 || loading}
//                 onClick={sendOtp}
//                 className="primary-btn"
//               >
//                 {loading ? "Please wait..." : "Continue"}
//               </button>

//               <div className="divider">
//                 <span>OR</span>
//               </div>

//               <button className="google-btn" onClick={handleGoogleLogin}>
//                 <FcGoogle size={20} />
//                 <span>Continue with Google</span>
//               </button>

//               <button className="astrologer-btn" onClick={handleAstrologerLogin}>
//                 Login as Astrologer
//               </button>
//             </>
//           )}

//           {step === "otp" && (
//             <>
//               <h3>Verify OTP</h3>
//               <p className="subtitle">Enter the 6-digit code sent to {mobile}</p>

//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 maxLength="6"
//                 onChange={(e) => {
//                   setOtp(e.target.value.replace(/\D/g, ""));
//                   setError("");
//                 }}
//               />

//               <button
//                 disabled={otp.length !== 6 || loading}
//                 onClick={verifyOtp}
//                 className="primary-btn"
//               >
//                 {loading ? "Verifying..." : "Verify & Login"}
//               </button>

//               <button
//                 className="back-btn"
//                 onClick={() => {
//                   setStep("mobile");
//                   setOtp("");
//                   setMessage("");
//                   setError("");
//                 }}
//               >
//                 Change Number
//               </button>

//               <button className="resend-btn" onClick={sendOtp}>
//                 Resend OTP
//               </button>
//             </>
//           )}

//           {step === "register" && (
//             <>
//               <h3>Create Account</h3>
//               <p className="subtitle">Please enter your details to register</p>

//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => {
//                   setName(e.target.value);
//                   setError("");
//                 }}
//               />

//               <input type="tel" value={mobile} disabled className="disabled-input" />

//               <button
//                 disabled={!name.trim() || loading}
//                 onClick={registerUser}
//                 className="primary-btn"
//               >
//                 {loading ? "Registering..." : "Register & Continue"}
//               </button>

//               <button
//                 className="back-btn"
//                 onClick={() => {
//                   setStep("mobile");
//                   setName("");
//                   setMobile("");
//                   setError("");
//                   setMessage("");
//                 }}
//               >
//                 Back
//               </button>
//             </>
//           )}
//         </div>

//         {/* 🔥 REQUIRED FOR FIREBASE reCAPTCHA */}
//         {/* <div id="recaptcha-container"></div> */}
//       </motion.div>
//     </div>
//   );
// }

// ===========================================

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import authImage from "../assets/authImage.jpg";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./AuthModal.css";

// 🔥 Firebase imports
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

export default function AuthModal({ onClose, isLoggedIn, user }) {
  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  /* ---------------- REDIRECT IF LOGGED IN ---------------- */
  useEffect(() => {
    if (isLoggedIn && user) {
      onClose();
      navigate("/user-profile");
    }
  }, [isLoggedIn, user, navigate, onClose]);

  /* ---------------- CHECK USER (BACKEND) ---------------- */
  const checkUser = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    // try {
    //   const res = await fetch("/auth/check-user", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ mobile }),
    //   });

    //   const data = await res.json();

    //   if (!data.exists) {
    //     setStep("register");
    //   } else {
    //     await sendOtp();
    //   }
    // } catch {
    //   setError("Server error. Try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  /* ---------------- SETUP RECAPTCHA (from second code) ---------------- */
  // const setupRecaptcha = async () => {
  //   if (!window.recaptchaVerifier) {
  //     // RecaptchaVerifier signature: (container, parameters, auth)
  //     // ensure we pass container first and auth last
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       "recaptcha-container",
  //       { size: "invisible" },
  //       auth
  //     );
  //     try {
  //       await window.recaptchaVerifier.render();
  //     } catch (renderErr) {
  //       console.error("reCAPTCHA render failed:", renderErr);
  //       throw renderErr;
  //     }
  //   }
  // };

  const setupRecaptcha = () => {
    try {
      // 1. Clear any existing global verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // 2. Clear the container HTML
      const container = document.getElementById("recaptcha-container");
      if (container) container.innerHTML = "";

      // 3. Initialize fresh
      auth.useDeviceLanguage();
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
            setIsVerified(true);
          },
          "expired-callback": () => {
            setIsVerified(false);
            setupRecaptcha();
          },
        },
      );

      return window.recaptchaVerifier.render();
    } catch (err) {
      console.error("reCAPTCHA Init Error:", err);
    }
  };

  useEffect(() => {
    // Wait for modal animation to settle before initializing recaptcha
    const timer = setTimeout(() => {
      if (step === "mobile") {
        setupRecaptcha();
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
      setIsVerified(false); // Reset verification on cleanup
    };
  }, [step]);

  // const setupRecaptcha = async () => {
  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       "recaptcha-container", // ✅ first param
  //       {
  //         size: "invisible",
  //         callback: () => {
  //           console.log("Recaptcha verified");
  //         },
  //       },
  //       auth, // ✅ last param
  //     );

  //     await window.recaptchaVerifier.render();
  //     console.log("AUTH OBJECT:", auth);
  //   }
  // };

  /* ---------------- SEND OTP (from second code) ---------------- */
  const sendOtp = async () => {
    if (!navigator.onLine) {
      setError("No internet connection. Please check your network.");
      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit number.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Use the global window instance which is more stable for phone auth
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier || !isVerified) {
        setError("Please verify the reCAPTCHA checkbox first.");
        return;
      }

      const phoneNumber = `+91${mobile}`;
      console.log("SENDING OTP TO:", phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );

      window.confirmationResult = confirmationResult;
      setMessage("OTP sent successfully!");
      setStep("otp");
    } catch (err) {
      console.error("OTP ERROR:", err);

      // Reset reCAPTCHA on error so the user must solve it again
      setIsVerified(false);
      if (window.recaptchaVerifier) {
        setupRecaptcha();
      }

      if (
        err.code === "auth/invalid-app-credential" ||
        err.message?.includes("INVALID_APP_CREDENTIAL")
      ) {
        setError(
          "Authentication Error: Please ensure 'localhost' is added to 'Authorized Domains' in Firebase Console -> Authentication -> Settings.",
        );
      } else if (err.message?.includes("already-rendered")) {
        setError("Connection lag. Please try clicking once more.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Failed to send OTP. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => setError("");
    const handleOffline = () => setError("You are currently offline.");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  /* ---------------- REGISTER USER (BACKEND) ---------------- */
  // const registerUser = async () => {
  //   if (!name.trim()) {
  //     setError("Please enter your name");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   try {
  //     await fetch("/auth/register", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ name, mobile }),
  //     });

  //     await sendOtp();
  //   } catch {
  //     setError("Registration failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const registerUser = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    await sendOtp();
  };

  /* ---------------- VERIFY OTP ---------------- */
  // const verifyOtp = async () => {
  //   try {
  //     setLoading(true);

  //     const result = await window.confirmationResult.confirm(otp);
  //     const firebaseUser = result.user;

  //     let backendUser = null;
  //     let backendToken = null;
  //     try {
  //       const backendResp = await fetch(`${API_BASE_URL}/api/otp/verify-otp`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ phone: mobile, otp }),
  //       });
  //       const backendData = await backendResp.json();
  //       if (backendData?.success) {
  //         backendUser = backendData?.data?.user || null;
  //         backendToken = backendData?.data?.token || null;
  //       }
  //     } catch {
  //       // keep firebase-only session fallback
  //     }

  //     const sessionUser = {
  //       _id: backendUser?._id || null,
  //       id: backendUser?._id || firebaseUser.uid,
  //       name: backendUser?.name || name?.trim() || "User",
  //       mobileNo: backendUser?.mobileNo || mobile,
  //       phoneNumber: firebaseUser.phoneNumber,
  //     };

  //     localStorage.setItem("user", JSON.stringify(sessionUser));
  //     if (backendUser?._id) {
  //       localStorage.setItem("backendUserId", backendUser._id);
  //       localStorage.setItem("userId", backendUser._id);
  //     }
  //     if (backendToken) {
  //       localStorage.setItem("authToken", backendToken);
  //     }
  //     localStorage.setItem("isLoggedIn", "true");
  //     localStorage.setItem("authRole", "user");

  //     onClose();
  //     navigate("/user-profile");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Invalid OTP");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const verifyOtp = async () => {
    try {
      setLoading(true);

      // ✅ Firebase OTP verify
      const result = await window.confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      console.log("Firebase User:", firebaseUser);

    // ✅ Send to backend (NO OTP)
    const idToken = await firebaseUser.getIdToken();

const backendResp = await fetch(`${API_BASE_URL}/api/firebase/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    idToken: idToken,              // 🔥 REQUIRED
    firebaseUid: firebaseUser.uid,
    phone: firebaseUser.phoneNumber,
    name: name || "User",
  }),
});

      const data = await backendResp.json();
      console.log("Backend Response:", data);

      if (!data.success) {
        throw new Error(data.message);
      }

      // ✅ Save session
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("isLoggedIn", "true");

      onClose();
      navigate("/user-profile");
    } catch (err) {
      console.error(err);
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);

      const firebaseUser = result.user;
      let backendUser = null;
      let backendToken = null;
      try {
        const backendResp = await fetch(
          `${API_BASE_URL}/api/auth/social-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "Google User",
              profile: firebaseUser.photoURL || "",
            }),
          },
        );
        const backendData = await backendResp.json();
        if (backendResp.ok && backendData?.data) {
          backendUser = backendData.data;
          backendToken = backendData.token || null;
        }
      } catch {
        // fallback to firebase session only
      }

      const sessionUser = {
        _id: backendUser?._id || null,
        id: backendUser?._id || firebaseUser.uid,
        name: backendUser?.name || firebaseUser.displayName || "Google User",
        email: backendUser?.email || firebaseUser.email || "",
        profileImage: backendUser?.profile || firebaseUser.photoURL || "",
      };
      localStorage.setItem("user", JSON.stringify(sessionUser));
      if (backendUser?._id) {
        localStorage.setItem("backendUserId", backendUser._id);
        localStorage.setItem("userId", backendUser._id);
      }
      if (backendToken) {
        localStorage.setItem("authToken", backendToken);
      }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authRole", "user");

      onClose();
      navigate("/user-profile");
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTHER HANDLERS ---------------- */
  const handleAstrologerLogin = () => {
    onClose();
    navigate("/astrologer-login");
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("auth-backdrop")) {
      onClose();
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="auth-backdrop" onClick={handleBackdropClick}>
      <motion.div
        className="auth-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose}>
          <IoClose />
        </button>

        {/* LEFT */}
        <div className="auth-left">
          <img src={authImage} alt="Auth" />
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          {error && <p className="error-text">{error}</p>}
          {message && <p className="info-text">{message}</p>}

          <div
            id="recaptcha-container"
            className="recaptcha-box"
            style={{ display: step === "mobile" ? "flex" : "none" }}
          ></div>

          {step === "mobile" && (
            <>
              <h2>Log In</h2>
              <p className="subtitle">Enter your mobile number to continue</p>

              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                maxLength="10"
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, ""));
                  setError("");
                  setIsVerified(false); // Force re-verification if number changes
                }}
              />

              <button
                disabled={mobile.length !== 10 || loading || !isVerified}
                onClick={sendOtp}
                className="primary-btn"
              >
                {loading ? "Please wait..." : "Continue"}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button className="google-btn" onClick={handleGoogleLogin}>
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              <button
                className="astrologer-btn"
                onClick={handleAstrologerLogin}
              >
                Login as Astrologer
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <h3>Verify OTP</h3>
              <p className="subtitle">
                Enter the 6-digit code sent to {mobile}
              </p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                maxLength="6"
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
              />

              <button
                disabled={otp.length !== 6 || loading}
                onClick={verifyOtp}
                className="primary-btn"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                className="back-btn"
                onClick={() => {
                  setStep("mobile");
                  setOtp("");
                  setMessage("");
                  setError("");
                }}
              >
                Change Number
              </button>

              <button className="resend-btn" onClick={sendOtp}>
                Resend OTP
              </button>
            </>
          )}

          {step === "register" && (
            <>
              <h3>Create Account</h3>
              <p className="subtitle">Please enter your details to register</p>

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />

              <input
                type="tel"
                value={mobile}
                disabled
                className="disabled-input"
              />

              <button
                disabled={!name.trim() || loading}
                onClick={registerUser}
                className="primary-btn"
              >
                {loading ? "Registering..." : "Register & Continue"}
              </button>

              <button
                className="back-btn"
                onClick={() => {
                  setStep("mobile");
                  setName("");
                  setMobile("");
                  setError("");
                  setMessage("");
                }}
              >
                Back
              </button>
            </>
          )}
        </div>

        {/* 🔥 REQUIRED FOR FIREBASE reCAPTCHA */}
      </motion.div>
    </div>
  );
}