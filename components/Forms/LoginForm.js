import { Button, ThirdPartyButton } from "../Buttons";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { loginSchema } from "../../lib/validators/user-validator";
import { Formik, Form } from "formik";
import { InputField } from "../Inputs";

export default function LoginForm() {
  function handleSubmit() {
    console.log("submitted");
  }

  return (
    <div className="flex w-full flex-col gap-6 md:m-auto md:max-w-[480px]">
      <h1 className="mx-auto text-4xl font-semibold">Login</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form className="flex flex-col gap-4">
            <InputField type="email" label="Email" name="email" />
            <div className="flex flex-col gap-2">
              <InputField type="password" label="Password" name="password" />
              <Link href="/forgotpassword">
                <a className="self-end font-display text-sm font-medium text-green-500 hover:underline">
                  Forgot Password?
                </a>
              </Link>
            </div>
            <p className="text-center">
              Don't have an account?{" "}
              <Link href="/signup">
                <a className="font-display font-medium text-green-500 hover:underline">
                  Sign Up
                </a>
              </Link>
            </p>
            <Button type="submit">Login</Button>
          </Form>
        )}
      </Formik>
      <div className="overflow-hidden">
        <p
          className="flex w-full flex-row bg-white before:right-2 before:m-auto 
  before:-ml-[50%] before:h-[1px] before:w-1/2 before:flex-1 
  before:bg-gray-100 before:align-middle after:left-2 after:m-auto after:-mr-[50%] 
  after:h-[1px] after:w-1/2 after:flex-1 after:bg-gray-100 after:align-middle"
        >
          or
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <ThirdPartyButton
          icon={
            <Icon
              icon="flat-color-icons:google"
              className="h-[24px] w-[24px]"
            />
          }
          text="Login with Google"
        />
        <ThirdPartyButton
          icon={<Icon icon="logos:facebook" className="h-[24px] w-[24px]" />}
          text="Login with Facebook"
        />
      </div>
    </div>
  );
}