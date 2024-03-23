import { useEffect, useState } from "react";
import { validate } from "../../util/validator";
import { Input } from "../../components/Input/form_input";
import { SINGIN } from "../../util/constants";
import { CustomErrorViewer } from "../../components/ErrorViewer/show_error";
import Link from "next/link";
import Image from "next/image";
import { signInApi } from "../../services/auth";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getAuthToken } from "../../utils/storage";
import Icon from "../../components/icon";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { NextPage } from "next";
import { CustomButton } from "../../components/Button";
import dynamic from "next/dynamic";
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});

export default function Signin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const token = getAuthToken();

  useEffect(() => {
    if (!token || token == undefined) {
    } else {
      router.push("/dashboard");
    }
  }, [token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await signInApi(formData);
      const data = response.data;
      const isConfirmationSent = data.confirmationCode;

      if (isConfirmationSent) {
        router.push("/auth/verify");
      } else {
        setFormData({
          email: "",
          password: "",
        });
        setLoginError("Invalid Credentials");
      }
    } catch (error: any) {
      setFormData({
        email: "",
        password: "",
      });
      setLoginError("Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any, field: any) => {
    const updatedFormData = { ...formData, [field]: e };
    const validationErrors = validate(updatedFormData);
    setFormData(updatedFormData);
    setErrors(validationErrors);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
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

  return (
    <div className="responsive-container " style={divStyle}>
      
      <div className="flex flex-row justify-between ">
        <div className="flex justify-start items-center md:w-full ">
          <div
            className={`h-screen  py-12 px-12 bg-white md:z-50 lg:z-50 ${
              isSmallDevice ? "w-screen" : ""
            } lg:w-1/2 `}
          >
            <div>
              <h1 className="text-black text-5xl font-sans text-center mb-10">
                Hello, There! 
              </h1>
              <span className="text-center tex-2xl text-red-400">
                {loginError}
              </span>
            </div>
            <div className="w-">
              <div className="flex flex-col justify-center item-center font-sans">
                <label
                  htmlFor="email"
                  className="block mt-3 text-md font-small text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <Input
                  type={"text"}
                  name={"email"}
                  value={formData.email}
                  isError={errors.email == ""}
                  placeholder={"Enter your Email"}
                  onchange={(event) => handleChange(event, "email")}
                />

                <CustomErrorViewer
                  isShow={errors.email != ""}
                  text={errors.email}
                />

                <label
                  htmlFor="password"
                  className="block mt-3 text-md font-small text-gray-900 dark:text-white"
                >
                  Password
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    isError={errors.password == ""}
                    placeholder="Enter your Password"
                    onchange={(event) => handleChange(event, "password")}
                  />
                  <button
                    onClick={toggleShowPassword}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 pr-2 bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                  </button>
                </div>
                <div className="flex justif-center">
                {!formData.password ? (
                  ""
                ) : (
                  <PasswordChecklist
                    className=" text-sm"
                    rules={["capital", "specialChar", "minLength", "number"]}
                    minLength={8}
                    value={formData.password}
                  />
                )}
              </div>
                <div className="flex justify-end ">
                  <Link href="/auth/forgotPassword" className="mt-2 text-md">
                    <span className="pl-3 text-blue-600 cursor-pointer text-center">
                      {" "}
                      Forgot Password?
                    </span>
                  </Link>
                </div>

                <div className={` ${errors.password || errors.email ? ' flex justify-center mt-6 pointer-events-none opacity-50 ':'flex justify-center mt-6'} `}>

                  <CustomButton
                    onchange={handleSubmit}
                    text={
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
                        SINGIN
                      )
                    }
                  />
                </div>
                <div className="text-center mt-5">
                  <span className="text-gray-700">Don't have an account?</span>

                  <Link href="/auth/signup" className="text-blue-600">
                    {" "}
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:flex items-center justify-center  -mt-20 mx-auto hidden  ">
            <p className=" z-10  font-sans  text-4xl font-bold text-center hidden lg:block w-auto text-white">
            We will send a verification code via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Signin.needsAuth = false;
