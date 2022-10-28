import { profileSchema } from "../../lib/validators/user-validator";
import { Formik, Form } from "formik";
import { InputField } from "../Inputs";

export default function ProfileForm() {
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        image: {
          id: null,
          url: "",
        },
      }}
    >
      {() => {
        return (
          <Form>
            <InputField label="First Name" name="firstName" />
            <InputField label="Last Name" name="lastName" />
            <div className="mt-4">
              <Button autoWidth={true}>Save Changes</Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
