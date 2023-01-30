import Head from "next/head";
import { NavLayout } from "../components/Layouts";
import { UserOfferList, UserOfferListItem } from "../components/Lists";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import usePaginate from "../lib/hooks/usePaginate";
import { useState } from "react";
import { OfferCardSkeleton } from "../components/Loaders";
import { Button } from "../components/Buttons";
import { FacePendingFilled } from "@carbon/icons-react";

export default function Offers() {
  const tabs = ["all", "accepted", "waiting", "failed", "received"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const {
    data: offers,
    isEndReached,
    isLoading,
    size,
    setSize,
    mutate,
  } = usePaginate("/api/offers/user", 8, { status: activeTab });

  const userOffers =
    offers.length &&
    offers.map((offer, index) => {
      return (
        <UserOfferListItem mutate={mutate} key={offer?._id} offer={offer} />
      );
    });

  return (
    <div className="container mx-auto w-full">
      <Head>
        <title>Offers | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-1 py-6 sm:gap-4">
        {/* <h1
          className="py-4 text-2xl
        font-semibold md:py-6 md:text-3xl"
        >
          Offers
        </h1> */}
        <Tabs
          className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[auto_2fr]"
          onSelect={(index) => setActiveTab(tabs[index])}
        >
          <TabList className="flex w-full items-start gap-4 sm:w-[200px] sm:flex-col sm:gap-6 sm:pb-4">
            <Tab className="tab-varying" selectedClassName="tab-active">
              <p>All Offers</p>
            </Tab>
            <Tab className="tab-varying" selectedClassName="tab-active">
              <p>Accepted</p>
            </Tab>
            <Tab className="tab-varying" selectedClassName="tab-active">
              <p>Waiting</p>
            </Tab>
            <Tab className="tab-varying" selectedClassName="tab-active">
              <p>Failed</p>
            </Tab>
            <Tab className="tab-varying" selectedClassName="tab-active">
              <p>Received</p>
            </Tab>
          </TabList>
          <div>
            {/* All */}
            <TabPanel className="flex flex-col gap-6">
              <UserOfferList>
                {offers.length ? (
                  userOffers
                ) : !isEndReached ? (
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)
                ) : (
                  <li className="col-span-full row-span-full flex items-center justify-center">
                    <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                      <FacePendingFilled size={100} />
                      Nothing to show
                    </p>
                  </li>
                )}
                {isLoading &&
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)}
              </UserOfferList>
              {!isEndReached && !isLoading ? (
                <div className="mx-auto mb-8 w-full max-w-[300px]">
                  <Button secondary={true} onClick={() => setSize(size + 1)}>
                    Load More
                  </Button>
                </div>
              ) : null}
            </TabPanel>
            {/* Accepted */}
            <TabPanel className="flex flex-col gap-6">
              <UserOfferList>
                {offers.length ? (
                  userOffers
                ) : !isEndReached ? (
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)
                ) : (
                  <li className="col-span-full row-span-full flex items-center justify-center">
                    <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                      <FacePendingFilled size={100} />
                      Nothing to show
                    </p>
                  </li>
                )}
                {isLoading &&
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)}
              </UserOfferList>
              {!isEndReached && !isLoading ? (
                <div className="mx-auto mb-8 w-full max-w-[300px]">
                  <Button secondary={true} onClick={() => setSize(size + 1)}>
                    Load More
                  </Button>
                </div>
              ) : null}
            </TabPanel>
            {/* Waiting */}
            <TabPanel className="flex flex-col gap-6">
              <UserOfferList>
                {offers.length ? (
                  userOffers
                ) : !isEndReached ? (
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)
                ) : (
                  <li className="col-span-full row-span-full flex items-center justify-center">
                    <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                      <FacePendingFilled size={100} />
                      Nothing to show
                    </p>
                  </li>
                )}
                {isLoading &&
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)}
              </UserOfferList>
              {!isEndReached && !isLoading ? (
                <div className="mx-auto mb-8 w-full max-w-[300px]">
                  <Button secondary={true} onClick={() => setSize(size + 1)}>
                    Load More
                  </Button>
                </div>
              ) : null}
            </TabPanel>
            {/* Failed */}
            <TabPanel className="flex flex-col gap-6">
              <UserOfferList>
                {offers.length ? (
                  userOffers
                ) : !isEndReached ? (
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)
                ) : (
                  <li className="col-span-full row-span-full flex items-center justify-center">
                    <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                      <FacePendingFilled size={100} />
                      Nothing to show
                    </p>
                  </li>
                )}
                {isLoading &&
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)}
              </UserOfferList>
              {!isEndReached && !isLoading ? (
                <div className="mx-auto mb-8 w-full max-w-[300px]">
                  <Button secondary={true} onClick={() => setSize(size + 1)}>
                    Load More
                  </Button>
                </div>
              ) : null}
            </TabPanel>
            {/* Received */}
            <TabPanel className="flex flex-col gap-6">
              <UserOfferList>
                {offers.length ? (
                  userOffers
                ) : !isEndReached ? (
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)
                ) : (
                  <li className="col-span-full row-span-full flex items-center justify-center">
                    <p className="m-auto flex max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                      <FacePendingFilled size={100} />
                      Nothing to show
                    </p>
                  </li>
                )}
                {isLoading &&
                  [...Array(8)].map((_, i) => <OfferCardSkeleton key={i} />)}
              </UserOfferList>
              {!isEndReached && !isLoading ? (
                <div className="mx-auto mb-8 w-full max-w-[300px]">
                  <Button secondary={true} onClick={() => setSize(size + 1)}>
                    Load More
                  </Button>
                </div>
              ) : null}
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

Offers.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
