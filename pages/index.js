import Head from "next/head";
import { LocationBarterButtons } from "../components/Buttons";
import { ItemCard } from "../components/Cards";
import { NavLayout, CategoryLayout } from "../components/Layouts";
import { ItemCardSkeleton } from "../components/Loaders";
import usePaginate from "../lib/hooks/usePaginate";
import useMapStore from "../store/useMapStore";
import { Button } from "../components/Buttons";
import { FacePendingFilled } from "@carbon/icons-react";

export default function Home() {
  const { listingPosition, listingRadius, listingRegion } = useMapStore();

  // console.log(listingPosition, listingRadius, listingRegion);

  const {
    data: items,
    isEndReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  } = usePaginate("/api/items", 2, {
    ...(listingPosition && Object.keys(listingPosition).length
      ? { ...listingPosition, radius: listingRadius }
      : {}),
  });

  const itemCards =
    items?.length &&
    items.map((item) => (
      <ItemCard
        key={item._id}
        name={item.name}
        exchangeFor={item.exchangeFor}
        image={item.images[0].url}
        to="/1/1"
        time={item.duration}
        offers={1}
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
        <div
          className={`grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 pb-4 
           lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] lg:gap-6 lg:py-6 ${
             items && !items.length && isEndReached
               ? "min-h-[80vh] grid-cols-1 lg:grid-cols-1"
               : ""
           }`}
        >
          {itemCards ? (
            itemCards
          ) : !isEndReached ? (
            [...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)
          ) : (
            <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
              <FacePendingFilled size={100} />
              Nothing to show{" "}
              <span className="font-semibold">
                {listingRegion ? `${listingRegion} - ${listingRadius}km` : ""}
              </span>
            </p>
          )}
          {isLoading &&
            [...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)}
        </div>
        {!isEndReached && (
          <div className="mx-auto mb-8 w-full max-w-[300px]">
            <Button secondary={true} onClick={() => setSize(size + 1)}>
              Load More
            </Button>
          </div>
        )}
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
