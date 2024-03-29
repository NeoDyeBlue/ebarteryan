import { NavLayout } from "../../components/Layouts";
import Head from "next/head";
import { UserIdentification } from "@carbon/icons-react";
import dynamic from "next/dynamic";
// import { ResendOTP } from "otp-input-react";
const ResendOTP = dynamic(
  () => import("otp-input-react").then((mod) => mod.ResendOTP),
  {
    ssr: false,
  }
);
import { FormikProvider, Form, useFormik } from "formik";
import { Button } from "../../components/Buttons";
import { DotLoader } from "react-spinners";
import { useState, useRef, useEffect } from "react";
import { InputField } from "../../components/Inputs";
import { passwordResetSchema } from "../../lib/validators/user-validator";
import Countdown, { CountdownApi } from "react-countdown";

export default function PasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const resetFormik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: handlePasswordResetSubmit,
    validationSchema: passwordResetSchema,
  });

  async function handlePasswordResetSubmit(values) {
    try {
      setIsSubmitting(true);
      setShowCountdown(true);
      const res = await fetch(`/api/password/reset`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        setIsSubmitSuccess(true);
      } else if (result && !result.success && result.error == "UserError") {
        resetFormik.setFieldError("email", result.errorMessage);
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  }

  const renderButton = (buttonProps) => {
    return (
      <Button {...buttonProps}>
        {buttonProps.remainingTime !== 0
          ? `Resend in ${buttonProps.remainingTime} sec`
          : "Resend"}
      </Button>
    );
  };

  return (
    <div className="w-full">
      <Head>
        <title>Password Reset | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex min-h-[calc(100vh-70px-57.25px)] md:min-h-[calc(100vh-71.5px)]">
        <div
          className="m-auto flex max-w-[480px] flex-col items-center justify-center gap-6
        rounded-[10px] border border-gray-100 bg-white p-6 shadow-lg"
        >
          <UserIdentification size={100} className="text-gray-100" />
          <h1 className="text-4xl font-semibold">Password Reset</h1>
          <div className="flex flex-col gap-4 text-center">
            <p>Enter the email used in your account to reset its password.</p>
            <FormikProvider value={resetFormik}>
              <Form
                className="flex w-full flex-col gap-4"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              >
                <InputField
                  type="email"
                  name="email"
                  value={resetFormik.values.email}
                  placeholder="Your Email"
                />
                <div className="flex w-full flex-col items-center gap-4">
                  {showCountdown ? (
                    <ResendOTP
                      className="w-full"
                      renderButton={renderButton}
                      onResendClick={() => resetFormik.submitForm()}
                      renderTime={() => <></>}
                    />
                  ) : (
                    <Button
                      type="submit"
                      // onClick={() => countdownRef.current.api.start()}
                    >
                      <p>Send</p>
                    </Button>
                  )}
                </div>
              </Form>
            </FormikProvider>
          </div>
          {/* <p>
            Did&apos;nt receive it?{" "}
            <span className="font-display font-medium text-green-500 hover:underline">
              Resend
            </span>
          </p> */}
        </div>
      </div>
    </div>
  );
}

PasswordReset.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
