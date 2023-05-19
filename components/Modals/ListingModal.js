import { Add, FacePendingFilled } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import ReactModal from "react-modal";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useEffect, useRef, useState } from "react";
import useUserOfferStore from "../../store/useUserOfferStore";
import { ItemCard } from "../Cards";
import { useSession } from "next-auth/react";
import usePaginate from "../../lib/hooks/usePaginate";
import InfiniteScroll from "react-infinite-scroll-component";
import { ItemCardSkeleton, PopupLoader } from "../Loaders";
import useSocketStore from "../../store/useSocketStore";
import { toast } from "react-hot-toast";

export default function ListingModal({ onClose, isOpen }) {
  ReactModal.setAppElement("#__next");
  const modalRef = useRef();
  const { socket } = useSocketStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setOffer, item, setIsSubmitSuccess } = useUserOfferStore();
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll(modalRef?.current, { reserveScrollBarGap: true });
    } else {
      enableBodyScroll(modalRef?.current);
    }
  }, [isOpen]);

  const { data: session, status } = useSession();
  const {
    data: items,
    isEndReached,
    isLoading,
    size,
    totalDocs,
    setSize,
    error,
    mutate,
  } = usePaginate(`/api/items/user/${session?.user?.id}`, 8);

  const itemCards = (items.length ? items : []).map((itemData) => (
    <ItemCard
      key={itemData?._id || itemData?.id}
      name={itemData?.name}
      exchangeFor={itemData?.exchangeFor}
      image={itemData?.image?.url}
      duration={itemData?.duration}
      offers={itemData?.offersCount}
      createdAt={itemData?.createdAt}
      isRemoved={itemData?.isRemoved}
      isForListingSelection={true}
      onConfirmOffer={() => offerItem(item, itemData?._id)}
    />
  ));

  async function offerItem(item, listingItem) {
    try {
      setIsSubmitting(true);
      setIsSubmitSuccess(false);
      const res = await fetch(`/api/items/${item}/offers/listing`, {
        method: "POST",
        body: JSON.stringify({ item, listingItem }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();

      if (result?.success) {
        socket.emit("offer:create", {
          offer: result.data,
          room: result.data.item,
        });
        socket.emit("offer:count", item);
        setOffer(result.data);
        setIsSubmitSuccess(true);
        toast.success("Item offered");
        onClose();
      } else {
        setIsSubmitSuccess(false);
        toast.error("Can't offer item");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitSuccess(false);
      setIsSubmitting(false);
      toast.error("Can't offer item");
    }
  }

  return (
    <ReactModal
      ref={modalRef}
      contentLabel="Offer Listing Modal"
      isOpen={isOpen}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full items-end`}
      preventScroll={true}
      onRequestClose={onClose}
      closeTimeoutMS={150}
      // bodyOpenClassName="modal-open-body"
      className={`relative h-[70vh] w-full overflow-hidden rounded-t-[10px] bg-white
     py-6 shadow-lg md:m-auto md:h-[90vh] md:max-w-[480px] md:rounded-[10px]`}
    >
      <PopupLoader message="Offerring item" isOpen={isSubmitting} />
      <div
        id="listing-modal"
        className={`custom-scrollbar container mx-auto max-h-full overflow-y-auto md:px-6`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <h1 className="text-2xl font-semibold">Select Item</h1>
            <CircleButton
              onClick={onClose}
              icon={<Add className="rotate-[135deg]" size={32} />}
            />
          </div>
          {/* <OfferForm onClose={() => onClose()} /> */}
          <InfiniteScroll
            dataLength={items.length}
            next={() => setSize(size + 1)}
            hasMore={!isEndReached}
            scrollableTarget="listing-modal"
            className={`grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 pb-4 lg:gap-6 lg:py-6 ${
              !items.length && isEndReached ? "min-h-[80vh] grid-cols-1" : ""
            }`}
            loader={[...Array(8)].map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          >
            {items.length ? (
              itemCards
            ) : !isLoading ? (
              <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                <FacePendingFilled size={100} />
                Nothing to show
              </p>
            ) : null}
          </InfiniteScroll>
        </div>
      </div>
    </ReactModal>
  );
}
