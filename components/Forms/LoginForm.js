import { Button, ThirdPartyButton } from "../Buttons";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { loginSchema } from "../../lib/validators/user-validator";
import { Formik, Form } from "formik";
import { InputField } from "../Inputs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { PropagateLoader } from "react-spinners";

export default function LoginForm() {
  const router = useRouter();
  async function handleSubmit(values, actions) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res.ok) {
      router.push("/");
    } else if (
      res.error &&
      (res.error.name == "PasswordError" || res.error.name == "UserError")
    ) {
      actions.setFieldError("email", res.error);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: process.env.VERCEL_URL });
  }

  async function handleFacebookSignIn() {
    // await signIn("facebook", { callbackUrl: process.env.VERCEL_URL });
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
              <Link href="/password/reset">
                <a className="self-end font-display text-sm font-medium text-green-500 hover:underline">
                  Forgot Password?
                </a>
              </Link>
            </div>
            <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <a className="font-display font-medium text-green-500 hover:underline">
                  Sign Up
                </a>
              </Link>
            </p>
            <Button disabled={props.isSubmitting} type="submit">
              {props.isSubmitting ? (
                <PropagateLoader
                  color="#fff"
                  size={14}
                  className="flex h-[22.5px] w-full items-center justify-center"
                />
              ) : (
                "Login"
              )}
            </Button>
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
          onClick={handleGoogleSignIn}
          icon={
            <Icon
              icon="flat-color-icons:google"
              className="h-[24px] w-[24px]"
            />
          }
          text="Login with Google"
        />
        {/* <ThirdPartyButton
          onClick={handleFacebookSignIn}
          icon={<Icon icon="logos:facebook" className="h-[24px] w-[24px]" />}
          text="Login with Facebook"
        /> */}
      </div>
    </div>
  );
}
