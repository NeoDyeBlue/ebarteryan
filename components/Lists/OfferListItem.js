import Image from "next/image";
import { CircleButton } from "../Buttons";
import {
  OverflowMenuVertical,
  Add,
  Chat,
  Checkmark,
  StarFilled,
} from "@carbon/icons-react";
import { ConditionBadge } from "../Misc";
import { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import format from "date-fns/format";
import { Button } from "../Buttons";
import { toast } from "react-hot-toast";
import { PopupLoader } from "../Loaders";
import { ConfirmationModal } from "../Modals";
import useSocketStore from "../../store/useSocketStore";
import useMessagesStore from "../../store/useMessagesStore";
import { useSession } from "next-auth/react";
import { DotLoader } from "react-spinners";
// import { KebabMenu, KebabMenuItem } from "../Navigation";

export default function OfferListItem({
  offer,
  withButtons,
  onAccept,
  withoutBorder,
}) {
  //states
  const [currentImage, setCurrentImage] = useState(0);
  const [acceptConfirmationOpen, setAcceptConfirmationOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConvoLoading, setIsConvoLoading] = useState(false);

  const { data: session } = useSession();

  //stores
  const { socket } = useSocketStore();
  const { setIsMessagesOpen, setConversation, conversation, setOfferChatData } =
    useMessagesStore();

  //elements
  const itemImages = offer?.images?.map((image, index) => (
    <div
      key={image.cloudId || index}
      onClick={() => openImageViewer(index)}
      className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md"
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

  //callbacks
  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  //functions
  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  function showConfirmation() {
    setAcceptConfirmationOpen(true);
  }

  async function openChat() {
    try {
      setIsConvoLoading(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          receiver: offer?.user?._id,
          item: offer?.item,
          offer: offer?._id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        joinConversation(result.data.convo);
        setOfferChatData(result.data?.newOffer ? offer : null);
        // if (result.data?.newOffer) {
        //   setOfferChatData(offer);
        //   // const receiver = result.data.convo.members.find(
        //   //   (member) => member.user._id !== (session && session.user.id)
        //   // ).user._id;
        //   // socket.emit("conversation:create", {
        //   //   conversation: result.data.convo,
        //   //   receiver,
        //   // });
        //   // const newOfferChat = {
        //   //   sender: session && session.user.id,
        //   //   receiver: receiver,
        //   //   conversation: result.data.convo,
        //   //   type: "offer",
        //   //   offer: offer?._id,
        //   // };
        //   // socket.emit("chat:create", newOfferChat);
        // }
        setIsMessagesOpen(true);
      } else if (!result.success) {
        toast.error("Can't intialize conversation");
      }
      setIsConvoLoading(false);
    } catch (error) {
      toast.error("Can't initialize conversation");
      setIsConvoLoading(false);
    }
  }

  function joinConversation(room) {
    if (conversation?._id !== room._id) {
      socket.emit("conversation:join", {
        newRoom: room._id,
        oldRoom: conversation?._id,
      });
      setConversation(room);
    }
  }

  async function handleAcceptConfirm() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/items/${offer.item}/offers/${offer._id}`, {
        method: "PATCH",
        body: JSON.stringify({ accepted: true }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        onAccept(true, offer);
        setIsLoading(false);
        socket.emit("offer:accept", {
          accepter: session && session.user.id,
          item: offer.item,
        });
        toast.success("Offer accepted");
      } else if (!result.success) {
        setIsLoading(false);
        toast.error(result.errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Can't accept offer");
    }
  }

  return (
    <li
      className={`relative flex flex-col gap-3
     ${withoutBorder ? "" : "border-b border-gray-100"} bg-white pb-4 md:gap-6
     `}
    >
      <PopupLoader message="Accepting Offer" isOpen={isLoading} />
      <ConfirmationModal
        isOpen={acceptConfirmationOpen}
        label="Accept Offer?"
        onClose={() => setAcceptConfirmationOpen(false)}
        onConfirm={handleAcceptConfirm}
        message="Once the offer was accepted your item will not accept any more offers unless the offer was removed or deleted"
      />
      {isViewerOpen && (
        <ImageViewer
          backgroundStyle={{
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.75)",
            padding: "1.5rem",
          }}
          closeComponent={<Add className="rotate-[135deg]" size={48} />}
          src={offer?.images.map((image) => image.url)}
          currentIndex={currentImage}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="font-display font-medium">{offer?.name}</p>
            <p className="mt-[0.05rem] flex flex-col gap-2 text-sm text-gray-300 sm:flex-row">
              <span>
                {offer?.region || offer?.location?.region} •{" "}
                {offer?.createdAt && format(new Date(offer?.createdAt), "PP")}{" "}
              </span>
              <ConditionBadge condition={offer?.condition} />{" "}
              {offer?.edited ? "(edited)" : ""}
            </p>
          </div>
          {/* <KebabMenu>
            <KebabMenuItem>Report</KebabMenuItem>
          </KebabMenu> */}
        </div>
        <p>{offer?.description || "Description"}</p>
        <div className="grid max-w-[calc((0.25rem*2+300px))] grid-cols-[repeat(auto-fill,_minmax(100px,_100px))] gap-1 overflow-hidden">
          {itemImages}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-2 self-start md:flex-row md:items-center">
        <div className="flex w-full items-center gap-4">
          <div className="relative h-[48px] w-[48px] flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={offer?.user?.image?.url}
              layout="fill"
              alt="user image"
              // objectFit="cover"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="min-w-[150px] font-display">
                {offer?.user?.fullName ||
                  `${offer?.user?.firstName} ${offer?.user?.lastName}`}
              </p>
              <div className="flex gap-1">
                <span className="flex w-full items-center justify-start gap-1">
                  <StarFilled size={18} />
                  <span>{offer?.user?.reviews?.rating || 0}</span>
                  <span className="text-gray-200">{`(${
                    offer?.user?.reviews?.count || 0
                  })`}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {withButtons && (
          <div className="flex w-full justify-end gap-2">
            <Button
              disabled={isConvoLoading}
              underlined
              autoWidth
              small
              onClick={openChat}
            >
              {isConvoLoading ? (
                <DotLoader size={20} color="#85CB33" />
              ) : (
                <>
                  <Chat size={20} />
                  <p className="hidden lg:block">Ask about the offer</p>
                </>
              )}
            </Button>
            {!offer.accepted && (
              <Button
                autoWidth
                small
                onClick={showConfirmation}
                disabled={isLoading}
              >
                <Checkmark size={20} />
                <p>Accept</p>
              </Button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
