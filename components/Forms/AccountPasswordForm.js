import { accountPasswordSchema } from "../../lib/validators/user-validator";
import { FormikProvider, Form, useFormik } from "formik";
import { InputField } from "../Inputs";
import { Button } from "../Buttons";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PopupLoader } from "../Loaders";

export default function AccountPasswordForm() {
  const [isUpdating, setIsUpdating] = useState(false);
  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    validationSchema: accountPasswordSchema,
    onSubmit: handleProfileFormSubmit,
  });

  async function handleProfileFormSubmit(values) {
    try {
      setIsUpdating(true);
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        toast.success("Password changed");
      } else {
        passwordFormik.setFieldError("oldPassword", result.errorMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  }

  return (
    <FormikProvider value={passwordFormik}>
      <PopupLoader isOpen={isUpdating} message="Changing password..." />
      <Form className="flex w-full flex-col gap-4 md:py-5">
        <InputField
          label="Current Password"
          name="oldPassword"
          type="password"
        />
        <InputField label="New Password" name="newPassword" type="password" />
        <InputField
          label="Re-enter New Password"
          name="newPasswordConfirm"
          type="password"
        />
        <div className="mt-4">
          <Button autoWidth={true} type="submit">
            Change Password
          </Button>
        </div>
      </Form>
    </FormikProvider>
  );
}
