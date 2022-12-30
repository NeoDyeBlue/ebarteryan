import { Send, Image as ImageIcon } from "@carbon/icons-react";
import useSocketStore from "../../store/useSocketStore";
import useMessagesStore from "../../store/useMessagesStore";
import TextareaAutosize from "react-textarea-autosize";
import { FormikProvider, Form, useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ChatInput() {
  const { socket } = useSocketStore();
  const { conversation, chatList, setChatList } = useMessagesStore();
  const { data: session } = useSession();

  //formik
  const chatFormik = useFormik({
    initialValues: {
      body: "",
      images: [],
    },
    // validationSchema: questionSchema,
    onSubmit: sendChat,
  });

  useEffect(() => {
    if (socket) {
      socket.on("message-error", (error) => {
        toast.error(error);
      });

      return () => socket.off("message-error");
    }
  }, [socket]);

  function sendChat(values) {
    if (values.body || values.images.length) {
      const chat = {
        sender: session && session.user.id,
        conversation: conversation._id,
        images: values.images,
        body: values.body,
      };

      socket.emit("chat", chat);
      setChatList([
        ...chatList,
        {
          sender: session.user,
          type:
            values.images.length && !values.body
              ? "image"
              : values.images.length && values.body
              ? "mixed"
              : "text",
          offer: null,
          images: values.images,
          body: values.body,
        },
      ]);

      chatFormik.setFieldValue("images", []);
      chatFormik.setFieldValue("body", "");
    }
  }

  return (
    <FormikProvider value={chatFormik}>
      <Form className="flex items-end gap-3 py-3">
        <button type="button" className="h-[40px] text-green-500">
          <ImageIcon size={32} />
        </button>
        {/* <div
        className="max-h-[100px] w-full overflow-y-auto break-all rounded-[10px] bg-gray-100/50 bg-white
        px-3 py-2 font-body placeholder-gray-100 focus:outline-none"
        // ref={textBoxRef}
        contentEditable="true"
        // onInput={}
        suppressContentEditableWarning="true"
        role="textbox"
        placeholder="Enter message here"
      ></div> */}
        <TextareaAutosize
          name="body"
          onChange={chatFormik.handleChange}
          value={chatFormik.values.body}
          className="custom-scrollbar w-full resize-none overflow-y-auto break-all
      rounded-[10px] bg-gray-100/50 px-3 py-2 focus:outline-none"
          placeholder="Type message here"
        />
        <button type="submit" className="h-[40px] text-green-500">
          <Send size={32} />
        </button>
      </Form>
    </FormikProvider>
  );
}
