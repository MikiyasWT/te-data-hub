import { useEffect, useState } from "react";
//import { useAuth } from "../../api/context/use_auth";
import { validate } from "../../util/validator";
import { Input } from "../../components/Input/form_input";
import { RESET } from "../../util/constants";
import { CustomErrorViewer } from "../../components/ErrorViewer/show_error";
import Link from "next/link";
import Image from "next/image";
import { forgotPasswordApi } from "../../services/auth";
import { useRouter } from "next/router";
import { setResetToken } from "../../utils/storage";
import Modal from "react-modal";

import { NextPage } from "next";
import { CustomButton } from "../../components/Button";


interface MyComponentProps {
  // Your component props here
}

const forgotPassword: NextPage<MyComponentProps> & {
  needsAuth?: boolean;
} = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
  });

  const [forgotPasswordError, setForgotPasswordError] = useState("");
  //const [successfullySent,setSuccessfullySent] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  //const { login,error }: any = useAuth();

  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors: any = validate(formData);
    setErrors(validationErrors);

    try {
      const response = await forgotPasswordApi(formData);
      const data = response.data;
      const success = data.success;
      console.log(data);
      console.log(success);

      if (success) {
        setIsModalOpen(true);
        setFormData({
          email: "",
        });
      }
    } catch {
      setFormData({
        email: "",
      });
      setForgotPasswordError(
        "No user with such email was found, please enter a correct email"
      );
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
    backgroundSize: "cover",
    backgroundPosition: "center",
    ...(isSmallDevice ? {} : { backgroundImage: "url('/Background.svg')" }),
  };

  return (
    <div className="responsive-container" style={divStyle}>
      <div className="flex flex-row justify-between">
        <div className="flex justify-start items-center md:w-full">
          <div className="h-screen py-12 px-12 bg-white md:z-50 lg:z-50 w-full lg:w-1/2 ">
            <div>
              <h1 className="text-black text-5xl font-inter text-center mb-10 font-sans">
                Forgot Password
              </h1>
              <span className="text-lg text-center text-red-400">
                {forgotPasswordError}
              </span>
            </div>
            <div className="flex  flex-col justify-center item-center ">
              <label
                htmlFor="email"
                className="block mt-3 text-md font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <Input
                type={"text"}
                name={"name"}
                value={formData.email}
                isError={errors.email == ""}
                placeholder={"Enter your Email"}
                onchange={(event) => setFormData({ ...formData, email: event })}
              />

              <CustomErrorViewer
                isShow={errors.email != ""}
                text={errors.email}
              />
              <div className="text-center">
                <div className="py-2">
                  <p className="mt-4 text-md text-gray-400 font-sans">
                    Enter email to receive password reset instructions
                  </p>
                </div>
              </div>

              <div className={`flex justify-center mt-6 ${(formData.email === '')?'pointer-events-none opacity-50 ':''} `}>
                <CustomButton onchange={handleSubmit} text={RESET} />
              </div>
            </div>
          </div>
          <div className="lg:flex items-center justify-center  -mt-20 mx-auto hidden  ">
            <p className=" z-10  font-sans  text-4xl font-bold text-center hidden lg:block w-auto text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-black bg-opacity-50 absolute top-0 bottom-0 left-0 right-0 fixed sm:h-full w-[648px] md:w-[1440px] lg:w-[1440px] xl:w-full xl:h-full  z-50 flex justify-center items-center overflow-hidden"
        className="bg-white p-20 mx-auto h-[220px] w-[370px] md:w-[560px] rounded-8 outline-none"
      >
        <div className="text-center   ">
          {/* Add any additional content you need for the modal */}
          <div className="flex flex-row">
            <div className="text-center text-xl font-bold mx-auto">
              <p>
                We sent an email to your email address with a link to get back
                into your account
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

forgotPassword.needsAuth = false;
export default forgotPassword;
