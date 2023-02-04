import { NavLayout } from "../components/Layouts";
import Head from "next/head";
import { SavedList, SavedListItem } from "../components/Lists";
import usePaginate from "../lib/hooks/usePaginate";
import { toast } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { SavedItemSkeleton } from "../components/Loaders";
import { useState, useEffect } from "react";

export default function Saved() {
  const [savedList, setSavedList] = useState([]);
  const {
    data: items,
    isEndReached,
    isLoading,
    size,
    setSize,
  } = usePaginate("/api/items/saved", 10);

  useEffect(() => {
    setSavedList(items);
  }, [items]);

  const savedItems = savedList.map((item) => (
    <SavedListItem
      image={item.images[0].url}
      onDelete={() => removeItem(item._id)}
      key={item._id}
      name={item.name}
      description={item.description}
      exchangeFor={item.exchangeFor}
      to={`/items/${item._id}`}
    />
  ));

  async function removeItem(itemId) {
    try {
      const res = await fetch(`/api/items/saved?item=${itemId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result && result.success) {
        toast.success("Item removed from saved list");
        setSavedList((prev) => prev.filter((item) => item._id !== itemId));
      } else {
        toast.error("An error occured, please try again later");
      }
    } catch (error) {
      toast.error("An error occured, please try again later");
    }
  }

  return (
    <div className="container mx-auto min-h-screen w-full md:max-w-[900px]">
      <Head>
        <title>Saved Items | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col py-4">
        <h1
          className="py-4 text-2xl
          font-semibold"
        >
          Saved Items
        </h1>
        <div>
          <SavedList>
            <InfiniteScroll
              dataLength={items.length}
              next={() => setSize(size + 1)}
              hasMore={!isEndReached}
              className="flex flex-col gap-2"
              endMessage={
                <p className="mt-4 text-center text-gray-200">
                  Nothing more to show
                </p>
              }
              loader={[...Array(10)].map((_, i) => (
                <SavedItemSkeleton key={i} />
              ))}
            >
              {savedItems}
              {/* {items.length ? (
                savedItems
              ) : !isLoading ? (
                <li className="flex items-center justify-center text-center text-gray-200">
                  No saved items
                </li>
              ) : null} */}
            </InfiniteScroll>
          </SavedList>
        </div>
      </div>
    </div>
  );
}

Saved.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
