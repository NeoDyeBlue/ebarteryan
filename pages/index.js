import Head from "next/head";
import { LocationBarterButtons } from "../components/Buttons";
import { ItemCard } from "../components/Cards";
import { NavLayout, CategoryLayout } from "../components/Layouts";
import { ItemCardSkeleton } from "../components/Loaders";
import usePaginate from "../lib/hooks/usePaginate";
import useMapStore from "../store/useMapStore";
import { FacePendingFilled } from "@carbon/icons-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

export default function Home() {
  const { listingPosition, listingRadius, listingRegion } = useMapStore();

  // console.log(listingPosition, listingRadius, listingRegion);

  const {
    data: items,
    isEndReached,
    isLoading,
    isValidating,
    size,
    setSize,
  } = usePaginate("/api/categories/all", 8, {
    ...(listingPosition && Object.keys(listingPosition).length
      ? { ...listingPosition, radius: listingRadius }
      : {}),
  });
  const itemCards = (items.length ? items : []).map((item) => (
    <ItemCard
      key={item?._id || item?.id}
      name={item?.name}
      exchangeFor={item?.exchangeFor}
      image={item?.image?.url}
      to={`/items/${item?._id || item?.id}`}
      duration={item?.duration}
      offers={item?.offersCount}
      createdAt={item?.createdAt}
    />
  ));

  return (
    <div className="flex w-full flex-col gap-4">
      <Head>
        <title>eBarterYan | Barter Items at your Town</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LocationBarterButtons />
      <div className="container relative mx-auto">
        <InfiniteScroll
          dataLength={items.length}
          next={() => setSize(size + 1)}
          hasMore={!isEndReached}
          className={`grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 pb-4 
           lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] lg:gap-6 lg:py-6 ${
             !items.length && isEndReached
               ? "min-h-[80vh] grid-cols-1 lg:grid-cols-1"
               : ""
           }`}
          loader={[...Array(8)].map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        >
          <div className="col-span-full flex flex-col items-center gap-4">
            <p className="text-sm uppercase text-gray-100">advertisement</p>
            <div className="relative h-full min-h-[150px] w-full rounded-[10px] bg-gray-100/20">
              <Image
                src="/images/ad-sample.jpg"
                alt="ad-sample"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          {items.length ? (
            itemCards
          ) : !isLoading ? (
            <p className="col-span-full m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
              <FacePendingFilled size={100} />
              Nothing to show{" "}
              <span className="font-semibold">
                {listingRegion ? `${listingRegion} - ${listingRadius}km` : ""}
              </span>
            </p>
          ) : null}
        </InfiniteScroll>
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return (
    <NavLayout>
      <CategoryLayout />
      {page}
    </NavLayout>
  );
};
