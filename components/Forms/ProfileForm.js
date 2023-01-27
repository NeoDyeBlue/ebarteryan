import { profileSchema } from "../../lib/validators/user-validator";
import { FormikProvider, Form, useFormik } from "formik";
import { InputField } from "../Inputs";
import { Button } from "../Buttons";
import { Pen } from "@carbon/icons-react";
import { useFilePicker } from "use-file-picker";
import { useSession } from "next-auth/react";
import { useEffect, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { PopupLoader } from "../Loaders";

export default function ProfileForm() {
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    image: "",
  });
  const profileFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      image: "",
    },
    validationSchema: profileSchema,
    onSubmit: handleProfileFormSubmit,
  });

  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });

  useLayoutEffect(() => {
    setInitialValues((prev) => ({
      ...prev,
      firstName: session && session.user.firstName,
      lastName: session && session.user.lastName,
      image: session && session.user.image,
    }));
    profileFormik.setValues(
      {
        firstName: session && session.user.firstName,
        lastName: session && session.user.lastName,
        image: session && session.user.image,
      },
      false
    );
  }, [session]);

  useEffect(() => {
    if (filesContent.length) {
      profileFormik.setFieldValue("image", filesContent[0].content);
    }
  }, [filesContent]);

  async function handleProfileFormSubmit(values) {
    try {
      setIsUpdating(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        toast.success("Profile updated");
        await fetch("/api/auth/session?update");
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
      } else {
        toast.error("Can't update profile");
      }
      setIsUpdating(false);
    } catch (error) {
      toast.error("Can't update profile");
      setIsUpdating(false);
    }
  }

  return (
    <FormikProvider value={profileFormik}>
      <PopupLoader isOpen={isUpdating} message="Updating profile..." />
      <Form className="flex w-full flex-col gap-4 md:py-5">
        <div className="flex flex-col gap-2">
          <p className="font-display font-medium">Profile Picture</p>
          <div className="relative h-[150px] w-[150px]">
            <span
              className="absolute top-0 right-0 z-10 flex h-[36px] w-[36px] items-center
                      justify-center rounded-full border border-gray-100 bg-white shadow-md"
            >
              <Pen size={20} />
            </span>
            <button
              onClick={openFileSelector}
              type="button"
              className="relative h-full w-full overflow-hidden rounded-full shadow-md"
            >
              <Image
                src={profileFormik.values.image}
                layout="fill"
                objectFit="cover"
                alt="user image"
              />
            </button>
          </div>
        </div>
        <InputField
          label="First Name"
          name="firstName"
          placeholer="First Name"
        />
        <InputField label="Last Name" name="lastName" placeholer="Last Name" />
        <div className="mt-4">
          <Button
            // disabled={
            //   profileFormik.isSubmitting ||
            //   !profileFormik.isValid ||
            //   Object.is(profileFormik.values, initialValues)
            // }
            // disabled={!(profileFormik.isValid && profileFormik.dirty)}
            autoWidth={true}
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </FormikProvider>
  );
}
