import { NavLayout } from "../../components/Layouts";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import {
  ArrowsHorizontal,
  Need,
  StarFilled,
  FacePendingFilled,
} from "@carbon/icons-react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ItemCard } from "../../components/Cards";
import ProgressBar from "@ramonak/react-progress-bar";
import { ReviewList, ReviewListItem } from "../../components/Lists";
import { Button } from "../../components/Buttons";
import { ItemCardSkeleton } from "../../components/Loaders";
import usePaginate from "../../lib/hooks/usePaginate";
import { getSession } from "next-auth/react";
import { getUserInfo } from "../../lib/controllers/user-controller";
import useSWR from "swr";
import { DotLoader } from "react-spinners";

export async function getServerSideProps(context) {
  const { params } = context;
  const { user } = params;
  const session = await getSession(context);

  if (session && user == session?.user?.id) {
    return {
      redirect: {
        permanent: false,
        destination: "/profile",
      },
      props: {},
    };
  }

  if (!user) {
    return { notFound: true };
  }

  const userInfo = await getUserInfo({ _id: user });

  if (!userInfo) {
    return { notFound: true };
  }

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(userInfo)),
    },
  };
}

export default function OtherProfile({ userInfo }) {
  const {
    data: items,
    isEndReached,
    isLoading,
    size,
    totalDocs,
    setSize,
    error,
  } = usePaginate(`/api/items/user/${userInfo?._id}`, 8);

  const {
    data: reviews,
    isEndReached: reviewsEndReached,
    isLoading: reviewsLoading,
    size: reviewsSize,
    totalDocs: reviewstotalDocs,
    setSize: setReviewsSize,
    error: reviewsError,
  } = usePaginate(`/api/reviews/${userInfo._id}`, 10);

  const { data: reviewStats, error: reviewStatsError } = useSWR(
    `/api/reviews/${userInfo._id}/info`
  );

  const userReviews =
    reviews.length &&
    reviews.map((review) => (
      <ReviewListItem key={review?._id} review={review} />
    ));

  const itemCards =
    items.length &&
    items.map((item) => (
      <ItemCard
        key={item._id || item.id}
        name={item.name}
        exchangeFor={item.exchangeFor}
        image={item.image.url}
        to={`/items/${item._id || item.id}`}
        duration={item.duration}
        offers={item.offersCount}
        createdAt={item.createdAt}
      />
    ));
  return (
    <div className="w-full py-4">
      <Head>
        <title>
          {userInfo?.firstName} {userInfo?.lastName} | User Profile
        </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col gap-6">
        {/* profile info */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:py-4">
          <div className="relative min-h-[150px] min-w-[150px] overflow-hidden rounded-full shadow-md">
            {userInfo.image.url && (
              <Image
                src={userInfo.image.url}
                layout="fill"
                objectFit="cover"
                alt="user image"
              />
            )}
          </div>
          <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
            <h1 className="text-center text-3xl font-semibold md:text-left">
              {userInfo.firstName} {userInfo.lastName}
            </h1>
            <div className="flex flex-col items-center gap-2 md:items-start md:gap-2">
              <p className="text-gray-300">
                Joined in {new Date(userInfo.createdAt).getFullYear()}
              </p>
              <div className="flex w-full items-end justify-center gap-2">
                <Rating
                  className="align-middle"
                  transition
                  allowHalfIcon
                  fillColor="#85CB33"
                  emptyColor="#D2D2D2"
                  initialValue={4.5}
                  readonly
                  size={24}
                />
                <p>•</p>
                <p className="text-[15px]">10</p>
              </div>
              <Link href="#reviews">
                <a className="font-medium underline">See Reviews</a>
              </Link>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-between gap-8 md:w-auto md:items-end">
            <div className="flex w-full gap-4 md:w-auto md:gap-8">
              <div className="flex w-full flex-col items-center gap-2 md:justify-center">
                <div className="flex items-center gap-2">
                  <ArrowsHorizontal size={32} />
                  <p className="text-2xl">8</p>
                </div>
                <p className="text-center font-display text-sm md:whitespace-nowrap">
                  Bartered Items
                </p>
              </div>
              <div className="w-[1px] bg-gray-100"></div>
              <div className="flex w-full flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <Need size={32} />
                  <p className="text-2xl">10</p>
                </div>
                <p className="text-center font-display text-sm md:whitespace-nowrap">
                  Offered Items
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* tabs */}
        <div className="w-full border-b border-gray-100">
          <Tabs className="flex flex-col gap-4">
            <div className="border-t border-t-gray-100">
              <TabList className="flex gap-4 md:gap-8">
                <Tab className="tab" selectedClassName="tab-active">
                  {/* <Thumbnail_2 size={24} /> */}
                  <p>Listings</p>
                  <span className="rounded-[10px] bg-gray-100 px-2 py-1 text-sm">
                    {totalDocs}
                  </span>
                </Tab>
              </TabList>
            </div>
            <div>
              <TabPanel>
                <div
                  className={`grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 pb-4 
           lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] lg:gap-6 lg:pb-6 ${
             !items.length && isEndReached
               ? "min-h-[80vh] grid-cols-1 lg:grid-cols-1"
               : ""
           }`}
                >
                  {items?.length ? (
                    itemCards
                  ) : !isEndReached || !error ? (
                    [...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)
                  ) : (
                    <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                      <FacePendingFilled size={100} />
                      Nothing to show
                    </p>
                  )}
                  {isLoading &&
                    [...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)}
                </div>
                {!isEndReached && !isLoading ? (
                  <div className="mx-auto mb-8 w-full max-w-[300px]">
                    <Button secondary={true} onClick={() => setSize(size + 1)}>
                      Load More
                    </Button>
                  </div>
                ) : null}
              </TabPanel>
              <TabPanel>
                <h2>Any content 2</h2>
              </TabPanel>
            </div>
          </Tabs>
        </div>
        {/* reviews */}
        <div
          id="reviews"
          className="flex scroll-mt-24 flex-col gap-6 md:flex-row"
        >
          <div className="flex flex-col gap-4 md:w-[35%]">
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 font-display text-2xl font-semibold">
                <StarFilled size={24} className="align-middle" />
                {reviewStats?.data?.weightedAverage || 0}
              </p>
              <p className="text-2xl text-gray-300">
                {reviewStats?.data?.totalReviews || 0} {"review(s)"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">5</p>
                <ProgressBar
                  completed={reviewStats?.data?.rates["5"]?.percentage || 0}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">4</p>
                <ProgressBar
                  completed={reviewStats?.data?.rates["4"]?.percentage || 0}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">3</p>
                <ProgressBar
                  completed={reviewStats?.data?.rates["3"]?.percentage || 0}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">2</p>
                <ProgressBar
                  completed={reviewStats?.data?.rates["2"]?.percentage || 0}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">1</p>
                <ProgressBar
                  completed={reviewStats?.data?.rates["1"]?.percentage || 0}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-[65%]">
            {reviews?.length && <ReviewList>{userReviews}</ReviewList>}
            {!reviewsEndReached && (
              <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
                <DotLoader color="#C7EF83" size={32} />
              </div>
            )}
            {!reviews.length && (
              <p className="m-auto flex min-h-[300px] max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                No Offers
              </p>
            )}
            {reviewsLoading && (
              <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
                <DotLoader color="#C7EF83" size={32} />
              </div>
            )}
            {!reviewsEndReached && !reviewsLoading ? (
              <div className="mx-auto mb-8 w-full max-w-[200px]">
                <Button
                  secondary={true}
                  onClick={() => setReviewsSize(reviewsSize + 1)}
                >
                  Load More
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

OtherProfile.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
