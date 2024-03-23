import { useEffect, useState } from "react";

import { validate } from "../../util/validator";
import { Input } from "../../components/Input/form_input";
import { RESET, VERIFY } from "../../util/constants";
import { CustomErrorViewer } from "../../components/ErrorViewer/show_error";
import Link from "next/link";
import Image from "next/image";
import { confirmEmailApi } from "../../services/auth";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
//import { setAuthToken, removeAuthToken } from "../../redux/action";
import { getAuthToken, setAuthToken } from "../../utils/storage";
import { CustomButton } from "../../components/Button";
import { decodeJwtToken, getTokenExpiration } from "../../utils/decodetoken";
import { setTokenCookie } from "../../utils/cookie";
import Cookies from "js-cookie";

export default function verify() {
  const authToken = useSelector((state: RootState) => state.authorizationToken);
  const dispatch = useDispatch();

  const router = useRouter();
  const [formData, setFormData] = useState({
    confirmationCode: "",
  });
  const [verificatonError, setVerificationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any, field: any) => {
    const updatedFormData = { ...formData, [field]: e };
    const validationErrors = validate(updatedFormData);
    setFormData(updatedFormData);
    setErrors(validationErrors);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors: any = validate(formData);
    setErrors(validationErrors);

    try {
      setIsLoading(true);
      const response = await confirmEmailApi(formData);
      const data = response.data;
      const success = data.success;
      const token = data.token;

      if (success) {
        await setAuthToken(token);

        const isCookieSet = await Cookies.set("token", token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });

        if (isCookieSet) {
          router.push("/dashboard");
        }
      } else if (!success) {
        setFormData({
          confirmationCode: "",
        });
        setVerificationError((prev) => !prev);
      }
    } catch {
      setFormData({
        confirmationCode: "",
      });
      setVerificationError((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  const token = getAuthToken();

  useEffect(() => {
    if (!token || token == undefined) {
    } else {
      router.push("/dashboard");
      window.location.href = "/dashboard";
    }
  }, [token, verificatonError]);

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
    <div className="responsive-container" style={divStyle}>
      <div className="flex flex-row justify-between">
        <div className="flex justify-start items-center md:w-full">
          <div
            className={`h-screen ${
              isSmallDevice ? "w-screen" : ""
            } py-12 px-12 bg-white md:z-50 lg:z-50 w-full lg:w-1/2 `}
          >
            <div>
              <h1 className="text-black text-5xl font-sans text-center mb-10">
                Verify your Email
              </h1>
              <span className=" text-xl text-red-400">
                <label
                  htmlFor="email"
                  className={`block mt-3 text-md font-medium  ${
                    verificatonError ? "text-red-400" : "text-white"
                  }`}
                >
                  {verificatonError
                    ? "Incorrect Confirmation code"
                    : "Confirmation Code"}
                </label>
              </span>
            </div>

            <Input
              type={"text"}
              name={"name"}
              value={formData.confirmationCode}
              isError={errors.confirmationCode == ""}
              placeholder={"Enter Confirmation code"}
              onchange={(event) =>
                setFormData({ ...formData, confirmationCode: event })
              }
            />

            <CustomErrorViewer
              isShow={errors.confirmationCode != ""}
              text={errors.confirmationCode}
            />
            <div className="text-center">
              <div className="py-2">
                <p className="mt-4 text-md text-gray-400 font-sans">
                  Enter Confirmation code sent via email
                </p>
              </div>
            </div>

            <div
              className={`flex justify-center mt-6  ${
                formData.confirmationCode === "" ||
                formData.confirmationCode.length < 6 ||
                formData.confirmationCode.length > 6
                  ? "pointer-events-none opacity-50 "
                  : ""
              }`}
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
                    VERIFY
                  )
                }
              />
            </div>
          </div>
          <div className="lg:flex items-center justify-center  -mt-20 mx-auto hidden  ">
            <p className=" z-10  font-sans  text-4xl font-bold text-center hidden lg:block w-auto text-white">
              Please enter the verification code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

verify.needsAuth = false;
