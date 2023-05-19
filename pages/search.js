import Head from "next/head";
import { LocationBarterButtons, FilterButton } from "../components/Buttons";
import { ItemCard } from "../components/Cards";
import { NavLayout, CategoryLayout } from "../components/Layouts";
import { ItemCardSkeleton } from "../components/Loaders";
import usePaginate from "../lib/hooks/usePaginate";
import useMapStore from "../store/useMapStore";
import { Button } from "../components/Buttons";
import { useRouter } from "next/router";
import { FacePendingFilled } from "@carbon/icons-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FilterModal } from "../components/Modals";
import { useState } from "react";

export default function Search() {
  const { listingPosition, listingRadius, listingRegion } = useMapStore();
  const router = useRouter();
  const { search_query } = router.query;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const {
    data: items,
    isEndReached,
    isLoading,
    size,
    setSize,
  } = usePaginate("/api/items/search", 8, {
    search_query,
    ...(listingPosition && Object.keys(listingPosition).length
      ? { ...listingPosition, radius: listingRadius, ...filters }
      : {}),
  });

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
    <div className="flex w-full flex-col gap-4">
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(value) => setFilters(value)}
        initialValues={filters}
      />
      <Head>
        <title>eBarterYan | Barter Items at your Town</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LocationBarterButtons />
      <div className="container relative mx-auto">
        {/* <InfiniteScroll
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
          {items.length ? (
            itemCards
          ) : !isLoading ? (
            <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
              <FacePendingFilled size={100} />
              Nothing to show{" "}
              <span className="font-semibold">
                {listingRegion ? `${listingRegion} - ${listingRadius}km` : ""}
              </span>
            </p>
          ) : null}
        </InfiniteScroll> */}
        <div
          className={`grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 pb-4 
           lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] lg:gap-6 lg:py-6 ${
             !items.length && isEndReached
               ? "min-h-[80vh] grid-cols-1 lg:grid-cols-1"
               : ""
           }`}
        >
          <div className="col-span-full flex h-fit justify-between gap-4 border-b border-b-gray-100 pb-4">
            {router.pathname == "/search" ? (
              <div className="flex min-h-[50px] w-full items-center overflow-hidden">
                <p className="overflow-hidden overflow-ellipsis whitespace-nowrap font-display font-medium">
                  Search results for:{" "}
                  <span className="font-normal">
                    &quot;{search_query}&quot;
                  </span>
                </p>
              </div>
            ) : (
              <div></div>
            )}
            <FilterButton
              onClick={() => setIsFilterOpen(true)}
              isActive={Object.keys(filters).length}
            />
          </div>
          {items?.length ? (
            itemCards
          ) : !isEndReached || isLoading ? (
            [...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)
          ) : (
            <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
              <FacePendingFilled size={100} />
              Nothing to show
            </p>
          )}
          {/* {isLoading &&
                    [...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)} */}
        </div>
        {!isEndReached && !isLoading ? (
          <div className="mx-auto mb-8 w-full max-w-[300px]">
            <Button secondary={true} onClick={() => setSize(size + 1)}>
              Load More
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

Search.getLayout = function getLayout(page) {
  return (
    <NavLayout>
      <CategoryLayout />
      {page}
    </NavLayout>
  );
};
