// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useChangePassword, useGetOtp, useVerifyOtp } from "./services/index";
// import CryptoJS from "crypto-js";
// import { SECRET_KEY } from "../../Config";
// import { toast } from "react-toastify";
// import { FaSpinner } from "react-icons/fa";

// /* ================= Loader ================= */
// const LoaderPage = () => {
//   return <FaSpinner className="animate-spin h-4 w-4 text-black" />;
// };

// /* ================= Component ================= */
// const SignupPage = ({ isOpen, setIsOpen }) => {
//   const { mutate: changePassword, isPending: isChange } = useChangePassword();
//   const { mutate: getOtp, isPending: isGettingOtp } = useGetOtp();
//   const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

//   const [step, setStep] = useState(1);
//   const [emailMatched, setEmailMatched] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({ mode: "onChange" });

//   const password = watch("password");

//   /* ================= STEP 1: GET OTP ================= */
//   const handleGetOtp = ({ loginId }) => {
//     const trimmedEmail = loginId?.trim()?.toLowerCase();

//     getOtp(
//       { email: trimmedEmail },
//       {
//         onSuccess: () => {
//           toast.success("OTP sent successfully.");
//           setEmailMatched(trimmedEmail);
//           setStep(2);
//         },
//         onError: (error) => {
//           toast.error(
//             error?.response?.data?.message || "Failed to send OTP. Try again.",
//           );
//         },
//       },
//     );
//   };

//   /* ================= STEP 2: VERIFY OTP ================= */
//   const handleVerifyOtp = ({ otp }) => {
//     if (!otp?.trim()) {
//       toast.error("Please enter OTP");
//       return;
//     }

//     verifyOtp(
//       {
//         email: emailMatched,
//         otp: otp.trim(),
//       },
//       {
//         onSuccess: () => {
//           toast.success("OTP verified successfully");
//           setStep(3);
//         },
//         onError: (err) => {
//           toast.error(err?.response?.data?.message || "Invalid OTP");
//         },
//       },
//     );
//   };

//   /* ================= STEP 3: UPDATE PASSWORD ================= */
//   const handleUpdatePassword = ({ password }) => {
//     const encryptedPassword = CryptoJS.AES.encrypt(
//       password.trim(),
//       SECRET_KEY,
//     ).toString();

//     const payload = {
//       LoginID: emailMatched,
//       Password: encryptedPassword,
//     };

//     changePassword(payload, {
//       onSuccess: () => {
//         toast.success("Password updated successfully.");
//         reset();
//         setStep(1);
//         setIsOpen(false);
//       },
//       onError: () => {
//         toast.error("Failed to update password.");
//       },
//     });
//   };

//   /* ================= Close Modal ================= */
//   const handleClose = () => {
//     setIsOpen(false);
//     setStep(1);
//     reset();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
//         {/* Close Button */}
//         <button
//           onClick={handleClose}
//           className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
//         >
//           &times;
//         </button>

//         <h2 className="text-2xl font-bold text-black text-center mb-6">
//           {step === 1
//             ? "OTP Verification"
//             : step === 2
//               ? "Verify OTP"
//               : "Set New Password"}
//         </h2>

//         {/* ================= STEP 1 ================= */}
//         {step === 1 && (
//           <form onSubmit={handleSubmit(handleGetOtp)} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email ID
//               </label>
//               <input
//                 type="text"
//                 {...register("loginId", {
//                   required: "Email ID is required",
//                 })}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//               />
//               {errors.loginId && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.loginId.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isGettingOtp}
//               className={`w-full py-2 rounded-lg font-medium transition ${
//                 isGettingOtp
//                   ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//             >
//               {isGettingOtp ? (
//                 <div className="flex justify-center items-center gap-2">
//                   <LoaderPage />
//                   Sending OTP...
//                 </div>
//               ) : (
//                 "Get OTP"
//               )}
//             </button>
//           </form>
//         )}

//         {/* ================= STEP 2 ================= */}
//         {step === 2 && (
//           <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 OTP
//               </label>
//               <input
//                 type="text"
//                 {...register("otp", { required: "OTP is required" })}
//                 placeholder="Enter OTP"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//               />
//               {errors.otp && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.otp.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isVerifyingOtp}
//               className={`w-full py-2 rounded-lg font-medium transition ${
//                 isVerifyingOtp
//                   ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//             >
//               {isVerifyingOtp ? (
//                 <div className="flex justify-center items-center gap-2">
//                   <LoaderPage />
//                   Verifying...
//                 </div>
//               ) : (
//                 "Verify OTP"
//               )}
//             </button>
//           </form>
//         )}

//         {/* ================= STEP 3 ================= */}
//         {step === 3 && (
//           <form
//             onSubmit={handleSubmit(handleUpdatePassword)}
//             className="space-y-4"
//           >
//             {/* New Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 New Password
//               </label>

//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   {...register("password", {
//                     required: "Password is required",
//                     validate: (value) => {
//                       const trimmed = value.trim();
//                       if (trimmed.length === 0)
//                         return "Password cannot be empty";
//                       if (trimmed.length < 6)
//                         return "Minimum 6 characters required";
//                       return true;
//                     },
//                   })}
//                   placeholder="New password"
//                   className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-2 text-gray-500 hover:text-black"
//                 >
//                   {showPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>

//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirm Password
//               </label>

//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   {...register("confirmPassword", {
//                     required: "Please confirm your password",
//                     validate: (value) =>
//                       value === password || "Passwords do not match",
//                   })}
//                   placeholder="Confirm password"
//                   className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-2 text-gray-500 hover:text-black"
//                 >
//                   {showConfirmPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>

//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isChange}
//               className={`w-full py-2 rounded-lg font-medium transition ${
//                 isChange
//                   ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//             >
//               {isChange ? (
//                 <div className="flex justify-center items-center gap-2">
//                   <LoaderPage />
//                   Updating...
//                 </div>
//               ) : (
//                 "Update Password"
//               )}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePassword, useGetOtp, useVerifyOtp } from "./services/index";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../../Config";

import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const LoaderPage = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        {/* Spinning Loader */}
        <FaSpinner className="animate-spin h-5 w-5 black-black-700 mx-auto mb-1" />
      </div>
    </div>
  );
};

const SignupPage = ({ isOpen, setIsOpen, userData, clientData }) => {
  const { mutate: changePassword, isPending: isChange } = useChangePassword();
  const { mutate: getOtp, isPending: isGettingOtp } = useGetOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  const [step, setStep] = useState(1);
  const [emailMatched, setEmailMatched] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //console.log("sercret key : ", SECRET_KEY);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const password = watch("password");

  // 🧠 Save OTP and expiry to localStorage
  // const saveOtpToLocal = (otp) => {
  //   const expiryTime = new Date().getTime() + 10 * 60 * 1000; // 10 mins in ms
  //   const otpData = {
  //     otp,
  //     expiry: expiryTime,
  //   };
  //   localStorage.setItem('otpData', JSON.stringify(otpData));
  // };

  // 🔍 Read and validate OTP from localStorage
  // const getValidOtpFromLocal = () => {
  //   const data = JSON.parse(localStorage.getItem('otpData'));
  //   if (!data) return null;

  //   const now = new Date().getTime();
  //   if (now > data.expiry) {
  //     localStorage.removeItem('otpData');
  //     return null;
  //   }
  //   return data.otp;
  // };

  const handleGetOtp = ({ loginId }) => {
    const trimmedEmail = loginId?.trim()?.toLowerCase();

    // const foundUser =
    //   userData?.data.find((user) => user?.LoginID?.trim()?.toLowerCase() === trimmedEmail) ||
    //   clientData?.data?.find((client) => client.LoginID?.trim()?.toLowerCase() === trimmedEmail);

    // if (!foundUser) {
    //   toast.dismiss();
    //   toast.error('Email is not registered. Please check and try again.');
    //   return;
    // }

    getOtp(
      { email: trimmedEmail },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.success("OTP sent successfully.");
          setEmailMatched(trimmedEmail);
          setStep(2);

          // 🧠 Save OTP locally (for dev/testing only)
          // if (data?.otp) {
          //   saveOtpToLocal(data.otp);
          // } else {
          //   toast.warning("No OTP returned from server. Can't verify.");
          // }
        },
        onError: (error) => {
          toast.dismiss();
          toast.error(
            error?.response?.data?.message || "Failed to send OTP. Try again.",
          );
        },
      },
    );
  };

  const handleVerifyOtp = ({ otp }) => {
    const enteredOtp = otp?.trim();

    if (!enteredOtp) {
      toast.error("Please enter OTP");
      return;
    }

    verifyOtp(
      {
        email: emailMatched, // 👈 email bhej rahe
        otp: enteredOtp, // 👈 otp bhej rahe
      },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully");
          setStep(3);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Invalid OTP");
        },
      },
    );
  };

  //   const handleVerifyOtp = ({ otp }) => {
  //     const enteredOtp = otp?.trim();
  //     const savedOtp = getValidOtpFromLocal();

  //     if (!savedOtp) {
  //       toast.error('OTP expired or not found. Please request a new one.');
  //       return;
  //     }
  // verifyOtp{

  // }
  //     if (enteredOtp === savedOtp) {
  //       toast.success('OTP verified.');
  //       setStep(3);
  //       localStorage.removeItem('otpData'); // clean up
  //     } else {
  //       toast.error('Invalid OTP. Please try again.');
  //     }
  //   };

  const handleUpdatePassword = ({ password }) => {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password.trim(),
      SECRET_KEY,
    ).toString();

    const payload = {
      LoginID: emailMatched,
      Password: encryptedPassword,
    };
    //console.log("11111111111 payload : ", payload);

    changePassword(payload, {
      onSuccess: () => {
        toast.success("Password updated successfully.");
        reset();
        setStep(1);
        setIsOpen(false);
        localStorage.removeItem("otpData"); // clean up
      },
      onError: () => {
        toast.error("Failed to update password.");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-lg h-auto p-6 relative`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            setStep(1);
            reset();
          }}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-5 text-black-600">
          {step === 1
            ? "OTP Verification"
            : step === 2
              ? "Verify OTP"
              : "Set New Password"}
        </h2>

        {/* Step 1: Enter Email */}
        {step <= 2 && (
          <form onSubmit={handleSubmit(handleGetOtp)} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Email ID{" "}
              </label>
              <input
                type="text"
                {...register("loginId", { required: "Email ID is required" })}
                placeholder="Enter your email id"
                className="w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
              />
              {errors.loginId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.loginId.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isGettingOtp}
              className="w-full bg-black-300 hover:bg-black-400 font-semibold py-2 bg-gray-300  px-4 rounded-md"
            >
              {isGettingOtp ? (
                <div className="flex justify-center items-center gap-2 ">
                  <LoaderPage className="w-4 h-4 mt-10" /> Sending OTP...
                </div>
              ) : (
                "Get OTP"
              )}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step <= 2 && (
          <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 mt-5">
                OTP
              </label>
              <input
                type="text"
                {...register("otp")}
                placeholder="Enter the OTP sent to your email"
                className="w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              // disabled={isVerifyingOtp}
              className="w-full bg-black-300 hover:bg-black-400 font-semibold py-2 px-4 rounded-md bg-gray-300 "
            >
              {"Verify OTP"}
            </button>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <form
            onSubmit={handleSubmit(handleUpdatePassword)}
            className="space-y-4 flex flex-col justify-evenly  h-auto"
          >
            {/* New Password */}
            <div>
              <label className="block text-[16px] font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) => {
                      const trimmed = value.trim();
                      if (trimmed.length === 0)
                        return "Password cannot be empty spaces";
                      if (trimmed.length < 6)
                        return "Password must be at least 6 characters";
                      return true;
                    },
                  })}
                  placeholder="New password"
                  className="w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-black-500"
                  tabIndex={-1}
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[16px] font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 border border-black-300  rounded-md focus:outline-none focus:ring-2 focus:ring-black-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-black-500"
                  tabIndex={-1}
                >
                  <i
                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isChange}
              className="w-full bg-black-300 hover:bg-black-400 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isChange ? (
                <>
                  <LoaderPage /> Submit...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
