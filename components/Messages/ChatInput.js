import { Send, Image as ImageIcon } from "@carbon/icons-react";
import useSocketStore from "../../store/useSocketStore";
import useMessagesStore from "../../store/useMessagesStore";
import TextareaAutosize from "react-textarea-autosize";
import ImageSelectorItem from "../Inputs/ImageSelectorItem";
import { FormikProvider, Form, useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useFilePicker } from "use-file-picker";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function ChatInput() {
  const { socket } = useSocketStore();
  const {
    conversation,
    chatList,
    setChatList,
    offerChatData,
    setOfferChatData,
  } = useMessagesStore();
  const { data: session } = useSession();

  //formik
  const chatFormik = useFormik({
    initialValues: {
      body: offerChatData ? "Can I ask about this offer?" : "",
      images: [],
    },
    // validationSchema: questionSchema,
    onSubmit: sendChat,
  });

  //fileselector
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: ["image/jpeg", "image/png", "image/gif"],
    multiple: true,
    // limitFilesConfig: { max: 10 },
    maxFileSize: 10,
  });

  const selectedImages = chatFormik.values.images.map((file, index) => (
    <ImageSelectorItem
      key={index}
      src={file.content}
      onRemove={() => removeImage(file)}
    />
  ));

  useEffect(() => {
    chatFormik.setFieldValue("images", [
      ...filesContent,
      ...chatFormik.values.images,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesContent]);

  useEffect(() => {
    if (socket) {
      socket.on("chat:error", (error) => {
        toast.error(error);
      });

      return () => socket.off("chat:error");
    }
  }, [socket]);

  function removeImage(image) {
    const newSelected = chatFormik.values.images.filter((img) => img !== image);
    chatFormik.setFieldValue("images", newSelected);
  }

  function sendChat(values) {
    if (values.body || values.images.length) {
      const tempId = uuidv4();
      let type = "text";
      if (values.images.length && !values.body) {
        type = "image";
      } else if (offerChatData) {
        type = "offer";
      } else if (values.images.length && values.body) {
        type = "mixed";
      }
      // const type =
      //   values.images.length && !values.body
      //     ? "image"
      //     : values.images.length && values.body
      //     ? "mixed"
      //     : "text";
      const chat = {
        sender: session && session.user.id,
        receiver: conversation.members?.find(
          (member) => member.user._id !== (session && session.user.id)
        ).user._id,
        conversation: conversation._id,
        images: values.images,
        body: values.body,
        type,
        tempId,
        offer: offerChatData?._id,
      };

      socket.emit("chat:create", chat);
      setChatList([
        ...chatList,
        {
          sender: session.user,
          type,
          offer: offerChatData,
          images: values.images,
          body: values.body,
          sent: false,
          tempId,
        },
      ]);

      setOfferChatData(null);
      chatFormik.setFieldValue("images", []);
      chatFormik.setFieldValue("body", "");
    }
  }

  return (
    <FormikProvider value={chatFormik}>
      <Form className="flex flex-col">
        {chatFormik.values.images.length ? (
          <div className="custom-scrollbar flex w-full gap-2 overflow-x-auto overflow-y-hidden py-2">
            {selectedImages}
          </div>
        ) : null}
        {offerChatData ? (
          <div className="flex w-full items-center gap-3 py-2">
            <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-[5px]">
              <Image
                src={offerChatData?.images[0]?.url}
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL="/images/placeholder.png"
                alt="thumbnail image"
              />
            </div>
            <p
              className="overflow-hidden overflow-ellipsis
              whitespace-nowrap font-display font-medium"
            >
              {offerChatData?.name}
            </p>
          </div>
        ) : null}
        <div className="flex items-end gap-3 py-3">
          {!offerChatData && (
            <button
              onClick={openFileSelector}
              type="button"
              className="h-[40px] text-green-500"
            >
              <ImageIcon size={32} />
            </button>
          )}
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
        </div>
      </Form>
    </FormikProvider>
  );
}
