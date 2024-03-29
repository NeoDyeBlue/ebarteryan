import { Form, FormikProvider, useFormik } from "formik";
import { DotLoader } from "react-spinners";
import { Button } from "../Buttons";
import { Textarea } from "../Inputs";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useSocketStore from "../../store/useSocketStore";
import format from "date-fns/format";
import { useSession } from "next-auth/react";

export default function QuestionAnswerListItem({ withInput, data }) {
  const { data: session } = useSession();
  const [isAnswerSubmitting, setIsAnswerSubmitting] = useState(false);
  const [answer, setAnswer] = useState(data?.answer);
  const answerFormik = useFormik({
    initialValues: {
      questionId: data?._id,
      answer: "",
    },
    onSubmit: handleAnswerSubmit,
  });
  const { socket } = useSocketStore();

  // console.log(data?.answer, answered);

  async function handleAnswerSubmit(values) {
    if (values.answer) {
      setIsAnswerSubmitting(true);
      const res = await fetch(`/api/questions/${data?.item}`, {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        setAnswer(result.data.answer);
        // console.log(result);
        socket.emit("question:answer", {
          answeredQuestion: result.data,
          answerer: session && session.user?.id,
          room: result.data.item,
        });
        toast.success("Question answered");
      } else {
        toast.error("Can't answer question");
      }
      setIsAnswerSubmitting(false);
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("question:answered", (answeredQuestion) => {
        if (data._id == answeredQuestion._id) {
          setAnswer(answeredQuestion.answer);
        }
      });

      return () => socket.off("question:answered");
    }
  }, [socket, data._id, data.answer]);

  return (
    <li className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display font-medium">
          {data?.user?.firstName} {data?.user?.lastName}
        </p>
        <p className="text-sm text-gray-300">
          {data?.createdAt && format(new Date(data?.createdAt), "PPp")}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-4">
          <span
            className="flex h-[24px] w-[24px] items-center justify-center 
          rounded-[5px] bg-info-500 font-display font-medium text-white"
          >
            Q
          </span>
          <p className="w-full rounded-[10px]">{data?.question}</p>
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
                  <div className="flex items-end gap-2">
                    <Textarea
                      className="border-gray-100"
                      placeholder="Type here..."
                      name="answer"
                      size="small"
                    />
                    <Button
                      autoWidth={true}
                      type="submit"
                      disabled={isAnswerSubmitting}
                      small
                    >
                      {isAnswerSubmitting ? (
                        <DotLoader color="#fff" size={24} />
                      ) : (
                        <p>Answer</p>
                      )}
                    </Button>
                  </div>
                </Form>
              </FormikProvider>
            )}
            {answer && <p className="w-full">{answer}</p>}
          </div>
        )}
      </div>
    </li>
  );
}
