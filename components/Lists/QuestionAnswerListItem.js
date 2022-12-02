import { Form, FormikProvider, useFormik } from "formik";
import { Button } from "../Buttons";
import { Textarea } from "../Inputs";

export default function QuestionAnswerListItem({
  withInput,
  question,
  answer,
}) {
  const answerFormik = useFormik({
    initialValues: {
      answer: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <li className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display font-medium">User Name</p>
        <p className="text-sm text-gray-300">1h ago</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-4">
          <span
            className="flex h-[24px] w-[24px] items-center justify-center 
          rounded-[5px] bg-info-500 font-display font-medium text-white"
          >
            Q
          </span>
          <p className="w-full rounded-[10px]">
            Laborum nulla consectetur id sit cupidatat reprehenderit ex minim
            nulla pariatur non?
          </p>
        </div>
        {(withInput || answer) && (
          <div className="flex items-start gap-4">
            <span
              className="flex h-[24px] w-[24px] items-center justify-center 
                rounded-[5px] bg-success-500 font-display font-medium text-white"
            >
              A
            </span>
            {withInput && !answer && (
              <FormikProvider value={answerFormik}>
                <Form className="flex w-full flex-col gap-4">
                  <div className="flex flex-col items-end gap-4 md:flex-row">
                    <Textarea
                      className="border-gray-100"
                      placeholder="Type here..."
                      name="answer"
                    />
                    <Button autoWidth={true} type="submit">
                      Answer
                    </Button>
                  </div>
                </Form>
              </FormikProvider>
            )}
            {answer && (
              <p className="w-full rounded-[10px] border border-gray-100 p-4">
                Laborum nulla consectetur id sit cupidatat reprehenderit ex
                minim nulla pariatur non
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
