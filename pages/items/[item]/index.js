import NavLayout from "../../../components/Layouts/NavLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import Head from "next/head";
import {
  Location,
  Need,
  ArrowsHorizontal,
  Add,
  Bookmark,
  BookmarkFilled,
  Collaborate,
  Delivery,
  Chat,
  Checkmark,
  StarFilled,
  Error,
} from "@carbon/icons-react";
import {
  Button,
  EditDeleteButtons,
  AnchorLinkButton,
} from "../../../components/Buttons";
import { IconLabel } from "../../../components/Icons";
import { OfferModal, ConfirmationModal } from "../../../components/Modals";
import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getItem } from "../../../lib/data-access/item";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { ConditionBadge } from "../../../components/Misc";
import useUserOfferStore from "../../../store/useUserOfferStore";
import { getUserOffer, getAcceptedOffer } from "../../../lib/data-access/offer";
import usePaginate from "../../../lib/hooks/usePaginate";
import useSocketStore from "../../../store/useSocketStore";
import ImageViewer from "react-simple-image-viewer";
import { PopupLoader } from "../../../components/Loaders";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { ItemPageTabs } from "../../../components/Tabs";
import useItemOffersStore from "../../../store/useItemOffersStore";
const InlineDropdownSelect = dynamic(
  () => import("../../../components/Inputs/InlineDropdownSelect"),
  {
    ssr: false,
  }
);

const MemoizedInlineDropdownSelect = memo(InlineDropdownSelect);

export async function getServerSideProps(context) {
  const { params } = context;
  try {
    const session = await getSession(context);
    const item = await getItem(params.item, session && session?.user?.id);
    let userOffer = null;
    let acceptedOffer = null;
    let fromUser = false;

    if (!item || item.isRemoved) {
      return { notFound: true };
    }

    acceptedOffer = await getAcceptedOffer(item._id);

    if (session && session?.user?.verified) {
      userOffer = await getUserOffer(item._id, session?.user?.id);
      fromUser = item?.user?._id == session?.user?.id;
    }
    return {
      props: {
        itemData: JSON.parse(JSON.stringify(item)),
        userOffer: JSON.parse(JSON.stringify(userOffer)),
        acceptedOffer: JSON.parse(JSON.stringify(acceptedOffer)),
        fromUser,
      },
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
}

export default function Item({ itemData, userOffer, fromUser, acceptedOffer }) {
  //----------states----------
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [availabilityConfirmationOpen, setAvailabilityConfirmationOpen] =
    useState(false);
  const [showMinifiedBar, setShowMinifiedBar] = useState(false);
  const [available, setAvailable] = useState(itemData.available);
  const [ended, setEnded] = useState(itemData?.ended);
  const [prevAvailability, setPrevAvailbility] = useState(itemData.available);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saved, setSaved] = useState(itemData?.requester?.isSaved);

  //others
  const { data: session, status } = useSession();
  const router = useRouter();
  const { socket } = useSocketStore();
  const {
    offer,
    setOffer,
    setItem,
    setIsForUpdating,
    setIsSubmitSuccess,
    tempOffer,
  } = useUserOfferStore();
  const { setAcceptedOffer, acceptedOffer: itemAcceptedOffer } =
    useItemOffersStore();

  const offers = usePaginate(`/api/items/${itemData._id}/offers`, 10);

  const questions = usePaginate(`/api/questions/${itemData._id}`, 10);

  const itemImages =
    itemData?.images?.length &&
    itemData.images.map((image, index) => (
      <div
        key={image.cloudId}
        onClick={() => openImageViewer(index)}
        className="relative aspect-square min-h-[200px] w-full cursor-pointer
        "
      >
        <Image
          src={image.url}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="/images/placeholder.png"
          alt="item image"
        />
      </div>
    ));

  const itemClaimingOptions = itemData.claimingOptions.map((option, index) => {
    let icon = null;
    if (option == "meetup") {
      icon = <Collaborate size={16} />;
    } else if (option == "delivery") {
      icon = <Delivery size={16} />;
    } else if (option == "undecided") {
      icon = <Chat size={16} />;
    }
    return (
      <IconLabel key={index}>
        {icon}
        <p className="text-sm capitalize">{option}</p>
      </IconLabel>
    );
  });

  //----------useCallbacks----------
  const updateOfferStore = useCallback(() => {
    setItem(itemData?._id);
    setOffer(userOffer);
    setAcceptedOffer(acceptedOffer);
    if (userOffer) {
      setIsSubmitSuccess(true);
    }
  }, [
    itemData,
    userOffer,
    setItem,
    setOffer,
    acceptedOffer,
    setAcceptedOffer,
    setIsSubmitSuccess,
  ]);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const updateAvailability = useCallback(async () => {
    setIsUpdating(true);
    const res = await fetch(`/api/items/${itemData?._id}`, {
      method: "PATCH",
      body: JSON.stringify({ available }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data && data.success) {
      toast.success("Availability changed");
      setIsUpdating(false);
      setPrevAvailbility(available);
    } else {
      setIsUpdating(false);
      toast.error("Can't update availability");
    }
  }, [available, itemData._id]);

  //----------useEffects----------

  useEffect(() => {
    updateOfferStore();
  }, [updateOfferStore]);

  useEffect(() => {
    setIsForUpdating(offer ? true : false);
  }, [offer, setIsForUpdating]);

  useEffect(() => {
    if (socket) {
      socket.emit("item:join", itemData?._id);

      return () => socket.emit("item:leave", itemData?._id);
    }
  }, [socket, itemData?._id]);

  useEffect(() => {
    const availabilityCheck = async () => {
      if (fromUser && available !== prevAvailability) {
        if (!available) {
          setAvailabilityConfirmationOpen(true);
        } else {
          await updateAvailability();
          setPrevAvailbility(available);
        }
      }
    };
    availabilityCheck();
  }, [available, fromUser, prevAvailability, updateAvailability]);

  //other functions
  async function handleSaveClick() {
    try {
      const res = await fetch(`/api/items/saved?item=${itemData._id}`, {
        method: "POST",
      });
      const result = await res.json();
      console.log(result);
      if (result && result.success) {
        toast.success(saved ? "Item removed from saved list" : "Item saved");
        setSaved((prev) => !prev);
      } else {
        toast.error("An error occured, please try again later");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occured, please try again later");
    }
  }

  function openOfferModal() {
    if (session && session.user.verified && status == "authenticated") {
      setOfferModalOpen(true);
    } else {
      router.push("/login");
    }
  }

  function closeOfferModal() {
    setOfferModalOpen(false);
    // setIsForUpdating(false);
  }

  function closeAvailabilityConfirmationModal() {
    setAvailabilityConfirmationOpen(false);
  }

  async function handleAvailabilityConfirmChange() {
    await updateAvailability();
  }

  function revertAvailabilityChange() {
    setAvailable(true);
  }

  function closeImageViewer() {
    setCurrentImage(0);
    setIsViewerOpen(false);
  }

  function handleOfferAcceptChange(value) {
    setEnded(value);
  }

  async function handleDeleteConfirmlick() {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/items/${itemData?._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result && result.success) {
        toast.success("Item deleted");
        router.push("/");
        // setIsDeleting(false);
      } else {
        toast.error("Can't delete item");
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("Can't delete item");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Head>
        <title>{itemData?.name || "Loading..."} | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Image Viewer */}
      {isViewerOpen && (
        <ImageViewer
          backgroundStyle={{
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.75)",
            padding: "1.5rem",
          }}
          closeComponent={<Add className="rotate-[135deg]" size={48} />}
          src={itemData?.images.map((image) => image.url)}
          currentIndex={currentImage}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
      {/* Modal */}
      <PopupLoader isOpen={isUpdating} message="Changing availability" />
      <PopupLoader isOpen={isDeleting} message="Deleting item..." />
      <ConfirmationModal
        onClose={closeAvailabilityConfirmationModal}
        isOpen={availabilityConfirmationOpen}
        label="Change Availability?"
        message="Changing availability to unavailable prevents others from sending offers to your item."
        onConfirm={handleAvailabilityConfirmChange}
        onCancel={revertAvailabilityChange}
      />
      <ConfirmationModal
        onClose={() => setIsDeleteConfirmationOpen(false)}
        isOpen={isDeleteConfirmationOpen}
        label="Delete Item?"
        message={
          itemData?.draft
            ? "This item will be gone forever"
            : "This item will be deleted forever and will affect offers!"
        }
        onConfirm={handleDeleteConfirmlick}
      />
      <OfferModal onClose={closeOfferModal} isOpen={offerModalOpen} />
      {/* ScrollTriggered Bar */}
      <AnimatePresence>
        {showMinifiedBar && (
          <motion.div
            className="fixed z-40 w-full bg-white py-3 shadow-md"
            initial={{ transform: "translateY(-100%)" }}
            animate={{ transform: "translateY(0%)" }}
            exit={{ transform: "translateY(-100%)" }}
            transition={{ type: "just", stiffness: 100 }}
          >
            <div className="container mx-auto flex items-center justify-between gap-4 md:gap-6">
              <div className="flex w-full items-center gap-3 overflow-hidden md:gap-4">
                <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-[5px]">
                  <Image
                    src={itemData.images[0].url}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/images/placeholder.png"
                    alt="thumbnail image"
                  />
                </div>
                <div
                  className="flex w-full max-w-full flex-col gap-1 overflow-hidden
                  md:flex-row md:justify-between md:gap-4"
                >
                  <div className="flex flex-col">
                    <p
                      className="overflow-hidden overflow-ellipsis
              whitespace-nowrap font-display text-xl font-semibold"
                    >
                      {itemData.name}
                    </p>
                    <div className="hidden items-start break-words text-sm md:flex">
                      <span className="mr-1 inline-block align-middle">
                        <Location size={16} />
                      </span>
                      <span className="mt-[0.12rem] flex gap-2">
                        <p className="inline">{itemData.region}</p>{" "}
                        <ConditionBadge condition={itemData.condition} />
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-fit w-auto items-center gap-2 self-start rounded-[5px] py-[0.2rem] 
                    md:my-auto`}
                  >
                    <p className="flex items-center gap-1 capitalize">
                      {ended || !available ? (
                        <Error size={16} />
                      ) : (
                        <Checkmark size={16} />
                      )}
                      {ended
                        ? "ended"
                        : !available
                        ? "unavailable"
                        : "available"}
                    </p>
                  </div>
                </div>
              </div>
              {available && !ended && !fromUser && (
                <div className="flex max-w-[250px] gap-3">
                  {offer ? (
                    <AnchorLinkButton elementId="offers-questions">
                      See Your Offer
                    </AnchorLinkButton>
                  ) : !itemData.ended || itemData.available ? (
                    <Button onClick={openOfferModal}>Offer Now</Button>
                  ) : null}
                  <div className="hidden md:block">
                    <Button onClick={handleSaveClick} secondary={true}>
                      {saved ? (
                        <BookmarkFilled className="text-green-500" size={20} />
                      ) : (
                        <Bookmark size={20} />
                      )}
                      {saved ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
              )}
              {fromUser && (
                <EditDeleteButtons
                  editLink={`/items/${itemData._id}/edit`}
                  onDeleteClick={() => setIsDeleteConfirmationOpen(true)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Item Info */}
      <div className="container mx-auto flex flex-col gap-4 md:gap-6 xl:max-w-[1200px]">
        {/* Carousel and other info */}
        <motion.div
          className="flex flex-col gap-6 pt-4 md:grid md:grid-cols-2 md:gap-8 md:pt-8"
          onViewportEnter={() => setShowMinifiedBar(false)}
          onViewportLeave={() => setShowMinifiedBar(true)}
        >
          <div className="-mx-6 -mt-4 w-auto md:col-start-1 md:row-start-2 md:m-0">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              className="md:overflow-hidden md:rounded-[10px]"
            >
              {itemImages}
            </Carousel>
          </div>
          <div className="item-center flex w-full justify-between gap-2 md:col-span-full md:row-span-full">
            <span
              className="flex w-full flex-row items-center gap-2 text-ellipsis whitespace-nowrap font-display 
            text-sm text-gray-300"
            >
              <Link href={`/${itemData.category.name}`}>
                <a className="capitalize underline hover:text-green-500">
                  {itemData.category.name}
                </a>
              </Link>
              <p>&#62;</p>
              <p className="text-black-light">{itemData.name}</p>
            </span>
            {fromUser && (
              <EditDeleteButtons
                editLink={`/items/${itemData._id}/edit`}
                onDeleteClick={() => setIsDeleteConfirmationOpen(true)}
              />
            )}
          </div>
          <div className="flex flex-col gap-4 md:col-start-2 md:row-start-2">
            <div className="flex flex-col gap-1 border-b border-b-gray-100 pb-6">
              <h1 className="text-3xl font-semibold md:text-3xl">
                {itemData.name}
              </h1>
              <div className="flex items-start break-words text-sm">
                <span className="mr-1 inline-block align-middle">
                  <Location size={16} />
                </span>
                <span className="mt-[0.12rem]">
                  <p className="inline">{itemData.region}</p> •{" "}
                  {format(new Date(itemData.createdAt), "PP")}{" "}
                  <ConditionBadge condition={itemData.condition} />{" "}
                  {itemData.edited ? "(edited)" : ""}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 pb-4">
              <h2 className="text-xl font-medium">Exchange for</h2>
              <p>{itemData.exchangeFor}</p>
            </div>
            <div className="flex flex-col gap-4 pb-6">
              <div className="flex min-h-[65px] items-center justify-between rounded-[10px] border border-gray-100 p-4">
                <p className="font-display font-medium">Availability</p>
                {itemData?.draft ? (
                  <p>Draft</p>
                ) : fromUser && !ended ? (
                  <MemoizedInlineDropdownSelect
                    name="availability"
                    items={[
                      { name: "available", value: true },
                      { name: "unavailable", value: false },
                    ]}
                    selected={available}
                    onChange={(value) => {
                      // console.log(value);
                      setAvailable(value);
                    }}
                  />
                ) : (
                  <div
                    className={`flex items-center gap-2 rounded-[5px] py-[0.2rem] px-3`}
                  >
                    <p className="flex items-center gap-1 capitalize">
                      {ended || !available ? (
                        <Error size={16} />
                      ) : (
                        <Checkmark size={16} />
                      )}
                      {ended
                        ? "ended"
                        : !available
                        ? "unavailable"
                        : "available"}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex min-h-[65px] flex-col gap-3 rounded-[10px] border border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
                <p className="w-fit font-display font-medium">
                  Claiming Options
                </p>
                <div className="flex flex-wrap justify-end gap-3">
                  {itemClaimingOptions}
                </div>
              </div>
            </div>
            {!itemData.draft &&
              (available && !ended && !fromUser ? (
                <div className="flex flex-col gap-3 md:flex-row">
                  {offer ? (
                    <AnchorLinkButton elementId="offers-questions">
                      See Your Offer
                    </AnchorLinkButton>
                  ) : !itemData.ended || itemData.available ? (
                    <Button onClick={openOfferModal}>Offer Now</Button>
                  ) : null}
                  <Button onClick={handleSaveClick} secondary={true}>
                    {saved ? (
                      <BookmarkFilled className="text-green-500" size={20} />
                    ) : (
                      <Bookmark size={20} />
                    )}
                    {saved ? "Saved" : "Save"}
                  </Button>
                </div>
              ) : (
                <AnchorLinkButton elementId="offers-questions">
                  See Offers
                </AnchorLinkButton>
              ))}
          </div>
        </motion.div>
      </div>
      {/* Description and Barterer*/}
      <div className="border-t border-gray-100">
        <div className="container mx-auto flex flex-col gap-4 pt-6 md:flex-row md:gap-6 xl:max-w-[1200px]">
          <div className="flex flex-col gap-3 pb-6 md:w-full md:border-0">
            <h2 className="text-xl font-medium">Description</h2>
            <p className="leading-8">{itemData.description}</p>
          </div>
          <div
            className="flex flex-col gap-4 rounded-[10px] border border-gray-100 bg-white p-6
          shadow-lg md:w-3/5"
          >
            <p className="font-display text-xl font-medium">Listed By</p>
            <div className="flex items-center justify-center gap-4">
              <Link href={`/profile/${itemData?.user?._id}`}>
                <a className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={itemData.user.image.url}
                    layout="fill"
                    objectFit="cover"
                    alt="user image"
                  />
                </a>
              </Link>
              <div>
                <p className="font-display font-medium">
                  {itemData.user.firstName} {itemData.user.lastName}
                </p>
                <p className="text-sm">
                  Joined in {new Date(itemData.user.createdAt).getFullYear()}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-100 p-4">
              <p className="font-display text-sm">Barterer Rating</p>
              <div className="flex w-full items-center justify-center gap-1 font-medium">
                <StarFilled size={20} />
                <span className="text-lg">
                  {itemData?.user?.reviews?.rating || 0}
                </span>
                <p>•</p>
                <span className="text-lg">
                  {itemData?.user?.reviews?.count || 0} reviews
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <ArrowsHorizontal size={32} />
                  <p className="text-2xl">
                    {itemData.user.barteredItems.count || 0}
                  </p>
                </div>
                <p className="text-center font-display text-sm">
                  Bartered Items
                </p>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <Need size={32} />
                  <p className="text-2xl">{itemData.user.offers.count || 0}</p>
                </div>
                <p className="text-center font-display text-sm">
                  Offered Items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div
        id="offers-questions"
        className="w-full scroll-mt-40 border-t border-t-gray-100
            pb-6 sm:pt-6"
      >
        {!itemData?.draft && (
          <ItemPageTabs
            itemId={itemData?._id}
            itemLister={itemData?.user}
            offersPaginated={offers}
            questionsPaginated={questions}
            showUserControls={fromUser}
            hasUserOffer={userOffer ? true : false}
            available={available && !ended}
            onUserOfferEdit={openOfferModal}
            onOfferAcceptChange={(value) => handleOfferAcceptChange(value)}
          />
        )}
      </div>
    </div>
  );
}

Item.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
