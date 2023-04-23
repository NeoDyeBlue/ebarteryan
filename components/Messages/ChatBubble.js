import Image from "next/image";
import Link from "next/link";
import { Add } from "@carbon/icons-react";
import ImageViewer from "react-simple-image-viewer";
import { useState, useCallback, useEffect } from "react";
import useMessagesStore from "../../store/useMessagesStore";
import { ProgressBarRound } from "@carbon/icons-react";

export default function ChatBubble({
  isFromUser,
  consecutive,
  type,
  userPic,
  images = [],
  offer,
  text,
  sent = true,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isSent, setIsSent] = useState(sent);

  const { setIsImageViewerOpen } = useMessagesStore();

  //elements
  const chatImages = images.map((image, index) => (
    <div
      key={index}
      onClick={() => openImageViewer(index)}
      className="relative aspect-square h-full w-full cursor-pointer
      overflow-hidden
      "
    >
      <Image
        src={image.url || image.content}
        layout="fill"
        objectFit="cover"
        placeholder="blur"
        blurDataURL="/images/placeholder.png"
        alt="selected image"
      />
    </div>
  ));

  //effects
  useEffect(() => {
    setIsSent(sent);
  }, [sent]);

  //callbacks
  const openImageViewer = useCallback(
    (index) => {
      setCurrentImage(index);
      setIsViewerOpen(true);
      setIsImageViewerOpen(true);
    },
    [setIsImageViewerOpen]
  );

  //functions
  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
    setIsImageViewerOpen(false);
  };
  return (
    <li
      className={`relative flex ${
        images.length || type == "offer"
          ? "w-[70%] max-w-[300px]"
          : "max-w-[70%]"
      } items-end gap-2 ${
        isFromUser ? "flex-row-reverse self-end" : "self-start"
      } ${consecutive ? "mb-1" : "mb-4"}`}
    >
      {isViewerOpen && (
        <ImageViewer
          backgroundStyle={{
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.75)",
            padding: "1.5rem",
          }}
          closeComponent={<Add className="rotate-[135deg]" size={48} />}
          src={images.map((image) => image.content || image.url)}
          currentIndex={currentImage}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
      {!isFromUser && (
        <div className="relative h-[24px] w-[24px] shrink-0 overflow-hidden rounded-full">
          {!consecutive ? (
            <Image
              src={userPic}
              objectFit="cover"
              alt="user pic"
              layout="fill"
            />
          ) : (
            <div className="h-[24px] w-[24px]"></div>
          )}
        </div>
      )}
      <div
        className={`flex w-full flex-col overflow-hidden whitespace-pre-wrap break-all rounded-t-[10px] ${
          isFromUser
            ? "rounded-bl-[10px] bg-green-500 text-white"
            : "rounded-br-[10px] bg-gray-100/30"
        }`}
      >
        {type == "offer" && offer && (
          <Link href={`/items/${offer?.item}`}>
            <a className="relative flex aspect-square h-full max-w-full cursor-pointer overflow-hidden">
              <Image
                src={offer?.images[0]?.url}
                objectFit="cover"
                alt="offer image"
                layout="fill"
                blurDataURL="/images/placeholder.png"
                placeholder="blur"
              />
            </a>
          </Link>
        )}
        {(type == "mixed" || type == "image") && images.length && (
          <div
            className={`grid max-w-full grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-1 bg-white`}
          >
            {chatImages}
          </div>
        )}
        {type == "offer" && offer && (
          <p className="mx-3 mt-3 -mb-2 text-sm font-semibold">{offer?.name}</p>
        )}
        {type !== "image" && <p className="p-3">{text}</p>}
      </div>
    </li>
  );
}
