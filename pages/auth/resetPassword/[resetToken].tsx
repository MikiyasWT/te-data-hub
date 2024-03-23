import React, { useState, useEffect } from "react";

import { validate } from "../../../util/validator";
import { Input } from "../../../components/Input/form_input";
import { CHANGEPASSWORD, SIGNUP } from "../../../util/constants";
import { CustomErrorViewer } from "../../../components/ErrorViewer/show_error";
import Link from "next/link";
import Image from "next/image";
import { getResetToken } from "../../../utils/storage";
import dynamic from "next/dynamic";
import { resetPasswordApi, signupApi } from "../../../services/auth";
import { Router, useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomButton } from "../../../components/Button";



const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});



export default function Reset() {
  const router = useRouter();
  const { resetToken } = router.query;

  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  const [formData, setFormData] = useState({
    
    newPassword: "",
    confirmPassword: "",
  });
  const [signupError, setSignupError] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.confirmPassword !== formData.newPassword) {
      setPasswordMismatchError(true);
      return
    }

    const validationErrors: any = validate(formData);
    setErrors(validationErrors);
    const { newPassword } = formData;
   const payload  = {
    resetToken,newPassword
   }
   
    try {
      setIsLoading(true);
      
      const response = await resetPasswordApi(payload);
    
      const data = response.data;
      const success = data.success;
      console.log(success);
      if (success) {
        toast.success(
          "Password has been reset successfully"
        );
        router.push("/auth/signin");
      }
      else if(!success && data.message === "Please enter a new password."){
        toast.warn(
          "Plese enter a new password"
        );
      }
    } catch {
      toast.error("unable to reset your password");
      setFormData({
        //resetToken: resetToken,
        newPassword: "",
        confirmPassword: "",
      });
      setSignupError("unable to reset password, please try again");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any, field: any) => {
    const validationErrors: any = validate(formData);

    {
      !formData ? "" : console.log("f" + field);
      setErrors(validationErrors);
      setFormData({ ...formData, [field]: e });
    }
  };

  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 768);
    };

    if (typeof window !== "undefined") {
      handleResize(); // Call it initially to set the initial value
      window.addEventListener("resize", handleResize); // Add event listener for resize
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize); // Clean up the event listener
      }
    };
  }, []);

  const divStyle = {
    ...(isSmallDevice
      ? { backgroundImage: "none" }
      : {
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: "url('/Background.svg')",
        }),
  };

  useEffect(() => {
    // if (!resetToken) {
    //   router.push("/auth/forgotPassword");
    // }
  }, [passwordMismatchError, resetToken]);
  return (
    <div className="responsive-container " style={divStyle}>
         <ToastContainer
        position="top-right"
        autoClose={4000}
        className="absolute  top-0 right-0 mt-20 p-4  w-[40px] max-w-sm"
      />
      <div className="flex flex-row justify-between  ">
        <div className="flex justify-start items-center md:w-full">
          <div
            className={`h-screen py-12 px-12 bg-white md:z-50 lg:z-50 w-full lg:w-1/2 ${
              isSmallDevice ? "w-screen" : ""
            } `}
          >
            <div className="top-[108px] left-[100px] lg:absolute ">
              <div>
                <h1 className="text-black  text-5xl font-sans text-center mb-10">
                  Change Password!
                </h1>
                <span className="text-red-400">{signupError}</span>
              </div>
              <div className=" flex  flex-col justify-center item-center font-sans">
                <label
                  htmlFor="password"
                  className="block mt-3 text-md font-small text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <Input
                  type={"password"}
                  name={"newPassword"}
                  value={formData.newPassword}
                  isError={errors.newPassword == ""}
                  placeholder={"New Password"}
                  onchange={(event) => handleChange(event, "newPassword")}
                />
                <div className="flex flex-col justif-center">
                  {!formData.newPassword ? (
                    ""
                  ) : (
                    <PasswordChecklist
                      className=" text-sm"
                      rules={["capital", "specialChar", "minLength", "number"]}
                      minLength={8}
                      value={formData.newPassword}
                    />
                  )}
                </div>

                <label
                  htmlFor="password"
                  className="block mt-3 text-md font-small text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>

                <Input
                  type={"password"}
                  name={"confirmPassword"}
                  value={formData.confirmPassword}
                  isError={errors.confirmPassword == ""}
                  placeholder={"Confirm Password"}
                  onchange={(event) => handleChange(event, "confirmPassword")}
                />
                {passwordMismatchError && (
                  <span className="text-xl text-red-400">
                    Password didn't match
                  </span>
                )}

                {/* <CustomErrorViewer isShow={error != null} text={error?.message || error} /> */}
                <div className={`flex justify-center mt-6 ${(formData.newPassword === '' || formData.newPassword.length < 8 || formData.confirmPassword === '' || formData.confirmPassword.length < 8)?'pointer-events-none opacity-50 ':''} `}>
                  <CustomButton onchange={handleSubmit} text=
                    {
                      isLoading ? (
                        <div
                          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                      ) : (
                        CHANGEPASSWORD
                      )
                    }
                     />
                </div>
              </div>
              <div className="text-center mt-4"></div>
            </div>

            <div className="text-center mt-4"></div>
          </div>
          <div className="lg:flex items-center justify-center  -mt-20 mx-auto hidden  ">
            <p className=" z-10  font-sans  text-4xl font-bold text-center hidden lg:block w-auto text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={false}
        className="absolute  top-0 right-0 mt-20 p-4  w-[40px] max-w-sm"
      />
    </div>
  );
}
