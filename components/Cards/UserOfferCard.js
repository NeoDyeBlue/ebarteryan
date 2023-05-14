import Image from "next/image";
import { CircleButton, Button } from "../Buttons";
import {
  OverflowMenuVertical,
  StarFilled,
  Add,
  Chat,
  Edit,
  TrashCan,
  Warning,
} from "@carbon/icons-react";
import { BarLoader, DotLoader } from "react-spinners";
import { ConditionBadge } from "../Misc";
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import format from "date-fns/format";
import useUserOfferStore from "../../store/useUserOfferStore";
import useSocketStore from "../../store/useSocketStore";
import { KebabMenu, KebabMenuItem } from "../Navigation";
import { toast } from "react-hot-toast";
import { PopupLoader } from "../Loaders";
import { ConfirmationModal } from "../Modals";
import useMessagesStore from "../../store/useMessagesStore";

export default function UserOfferCard({
  offer,
  isLoading = false,
  isSubmitSuccess = false,
  retryHandler,
  itemLister,
  isAccepted = false,
  onEdit,
}) {
  const { data: session, status } = useSession();
  const [currentImage, setCurrentImage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isConvoLoading, setIsConvoLoading] = useState(false);

  //stores
  const { setOffer, setOldOffer, oldOffer, setTempOffer } = useUserOfferStore();
  const { socket } = useSocketStore();
  const { setIsMessagesOpen, setConversation, conversation, setOfferChatData } =
    useMessagesStore();
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
        alt="item image"
      />
    </div>
  ));

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  async function resubmit() {
    await retryHandler();
  }

  function handleEditClick() {
    setOldOffer(offer);
    onEdit();
  }

  function showDeleteConfirmation() {
    setIsDeleteConfirmationOpen(true);
  }

  function hideDeleteConfirmationOpen() {
    setIsDeleteConfirmationOpen(false);
  }

  async function handleDeletelick() {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/offers/${offer?._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result && result.success) {
        socket.emit("offer:count", offer?.item);
        setOffer(null);
        toast.success("Offer deleted");
        setIsDeleting(false);
      } else {
        toast.error("Can't delete offer");
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("Can't delete offer");
      setIsDeleting(false);
    }
  }

  function handleCancelClick() {
    if (isForUpdating) {
      setOffer(oldOffer);
    } else {
      setOffer(null);
      setTempOffer(null);
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

  async function openChat() {
    try {
      setIsConvoLoading(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          receiver: itemLister?._id,
          item: offer?.item,
          offer: offer?._id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        joinConversation(result.data.convo);
        setOfferChatData(result.data?.newOffer ? offer : null);
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

  if (!offer.isRemoved) {
    return (
      <li
        className={`relative mb-1 flex flex-col gap-3
       md:gap-6 ${
         isLoading || !isSubmitSuccess
           ? "before:absolute before:z-10 before:h-full before:w-full before:bg-white/50"
           : ""
       }`}
      >
        <PopupLoader message="Deleting offer..." isOpen={isDeleting} />
        <ConfirmationModal
          onClose={hideDeleteConfirmationOpen}
          isOpen={isDeleteConfirmationOpen}
          label="Delete Offer"
          message="Deleting your offer will be gone forever!"
          onConfirm={handleDeletelick}
        />
        {isLoading ? (
          <BarLoader
            color="#85CB33"
            cssOverride={{
              width: "100%",
              marginBottom: "0.25rem",
              display: "block",
            }}
            // size={14}
            // width={200}
          />
        ) : null}
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
        {!isLoading && !isSubmitSuccess ? (
          <div className="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center p-4">
            <div className="flex w-full max-w-[200px] flex-col gap-3 drop-shadow-md md:flex-row">
              <Button onClick={resubmit}>Retry</Button>
              <Button underlined={true} onClick={handleCancelClick}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="font-display font-medium">
                {offer?.name || "Item Name"}
              </p>
              <p className="mt-[0.05rem] flex flex-col gap-2 text-sm text-gray-300 sm:flex-row">
                <span>
                  {offer?.region || offer?.location?.region} •{" "}
                  {offer?.createdAt && format(new Date(offer?.createdAt), "PP")}{" "}
                </span>
                <ConditionBadge condition={offer?.condition} />
              </p>
            </div>
            {/* <CircleButton icon={<OverflowMenuVertical size={24} />} /> */}
            {!isAccepted && (
              <KebabMenu>
                <KebabMenuItem onClick={handleEditClick}>
                  <Edit size={24} /> Edit Offer
                </KebabMenuItem>
                <KebabMenuItem onClick={showDeleteConfirmation}>
                  <TrashCan size={24} /> Delete Offer
                </KebabMenuItem>
              </KebabMenu>
            )}
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
                src={offer?.user?.image?.url || session?.user?.image}
                layout="fill"
                alt="user image"
                // objectFit="cover"
              />
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <p className="min-w-[150px] font-display">
                  {offer?.user?.fullName ||
                    `${session?.user?.firstName} ${session?.user?.lastName}`}
                </p>
                {/* <div className="flex gap-1">
                  <span className="flex w-full items-center justify-start gap-1">
                    <StarFilled size={18} />
                    <span>5</span>
                    <span className="text-gray-200">{"(10)"}</span>
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          {isAccepted && (
            <div className="flex w-full justify-end gap-2">
              <Button underlined autoWidth small onClick={openChat}>
                <div className="relative mr-1 h-[20px] w-[20px] overflow-hidden rounded-full">
                  <Image
                    src={itemLister?.image?.url}
                    alt="item lister image"
                    layout="fill"
                  />
                </div>
                {/* <Chat size={20} /> */}
                {isConvoLoading ? (
                  <DotLoader size={20} color="#85CB33" />
                ) : (
                  <>
                    <Chat size={20} />
                    <p className="hidden lg:block">
                      Chat {itemLister?.firstName}
                    </p>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </li>
    );
  } else {
    return (
      <li
        className={`relative mb-1 flex flex-col gap-3 rounded-[10px] border border-gray-100 p-4 md:gap-6`}
      >
        <PopupLoader message="Deleting offer..." isOpen={isDeleting} />
        <ConfirmationModal
          onClose={hideDeleteConfirmationOpen}
          isOpen={isDeleteConfirmationOpen}
          label="Delete Unavailable Offer?"
          onConfirm={handleDeletelick}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warning size={32} className="text-danger-500" />
            <p className="text-sm">
              {offer?.violation && (
                <span className="font-semibold capitalize">
                  {offer?.violation}.
                </span>
              )}{" "}
              Your offer was removed for its violation. Please refrain from
              offering such items.
            </p>
          </div>
          <Button small autoWidth onClick={showDeleteConfirmation}>
            Delete
          </Button>
        </div>
      </li>
    );
  }
}
