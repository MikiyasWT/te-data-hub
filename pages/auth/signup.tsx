import React, { useState, useEffect } from "react";
import { validate } from "../../util/validator";
import { Input } from "../../components/Input/form_input";
import { SIGNUP } from "../../util/constants";
import { CustomErrorViewer } from "../../components/ErrorViewer/show_error";
import Link from "next/link";
//import PasswordChecklist from "react-password-checklist";
import dynamic from "next/dynamic";
import { signupApi } from "../../services/auth";
import { fetchCompanies } from "../../services/auth";
import { Router, useRouter } from "next/router";
import { getAuthToken } from "../../utils/storage";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { CustomButton } from "../../components/Button";
const PasswordChecklist = dynamic(() => import("react-password-checklist"), {
  ssr: false,
});
interface Company {
  name: string;
  code: string;
  address: string;
  email: string;
}

export default function Signup() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    compantType: "KPE",
  });
  const [signupError, setSignupError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await fetchCompanies(); // Call the API service function
        const data = response.data;
        const success = data.success;
        if (success) {
          setCompanies(data.company); // Store the company data in the state variable
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCompanies();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors: any = validate(formData);
    setErrors(validationErrors);
    setIsLoading(true);

    try {
      const response = await signupApi(formData);
      const data = response.data;
      const success = data.success;
      console.log(success);
      if (success) {
        router.push("/auth/verify");
      }
    } catch {
      setSignupError("Email already registered");
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: "",
      }));
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

  const token = getAuthToken();

  useEffect(() => {
    if (!token || token == undefined) {
    } else {
      router.replace("/dashboard");
    }
  }, [token]);

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
      <div className="flex flex-row justify-between  ">
        <div className="flex justify-start items-center md:w-full">
          <div
            className={`h-full py-12 px-12 bg-white md:z-50 lg:z-50 w-full lg:w-1/2 ${
              isSmallDevice ? "w-screen" : ""
            } `}
          >
            <div>
              <h1 className="text-black text-5xl font-sans text-center mb-10">
                Welcome!
              </h1>
              <span className="text-xl text-center text-red-400">
                {signupError}
              </span>
            </div>
            <div className=" flex  flex-col justify-center item-center font-sans">
              <label
                htmlFor="first_name"
                className="block mt-2 text-md font-small text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <Input
                type={"text"}
                name={"firstName"}
                value={formData.firstName}
                isError={errors.firstName == ""}
                placeholder={"Enter your First name"}
                onchange={(event) => handleChange(event, "firstName")}
              />

              <CustomErrorViewer
                isShow={errors.firstName != ""}
                text={errors.firstName}
              />
              <label
                htmlFor="last_name"
                className="block mt-2 text-md font-sans text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <Input
                type={"text"}
                name={"lastName"}
                value={formData.lastName}
                isError={errors.lastName == ""}
                placeholder={"Enter your Last name"}
                onchange={(event) => handleChange(event, "lastName")}
              />

              <CustomErrorViewer
                isShow={errors.lastName != ""}
                text={errors.lastName}
              />
              <label
                htmlFor="email"
                className="block mt-2 text-md font-small text-gray-900 dark:text-white"
              >
                Email
              </label>
              <Input
                type={"email"}
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
                className="block mt-2 text-md font-small text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name={"password"}
                  value={formData.password}
                  isError={errors.password == ""}
                  placeholder={"Enter your Password"}
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
              <label
                htmlFor="Company"
                className="block mt-2 text-md font-small text-gray-900 dark:text-white"
              >
                Company
              </label>

              {/* <CustomErrorViewer isShow={error != null} text={error?.message || error} /> */}

              <div
                className={` ${
                  errors.password ||
                  errors.email ||
                  errors.firstName ||
                  errors.lastName
                    ? "flex justify-center mt-6 pointer-events-none opacity-50 "
                    : "flex justify-center mt-6"
                } `}
              >
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
                      SIGNUP
                    )
                  }
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="">
                <Link href="/auth/signin" className=" text-sm">
                  Already have an account?
                  <span className="pl-3 text-blue-600 cursor-pointer">
                    {" "}
                    Sign In
                  </span>
                </Link>
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
