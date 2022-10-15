import NavLayout from "../../components/Layouts/NavLayout";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { ArrowsHorizontal, Need, StarFilled } from "@carbon/icons-react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ItemCard from "../../components/Cards/ItemCard";
import ProgressBar from "@ramonak/react-progress-bar";
import ReviewList from "../../components/ReviewList";
import ReviewListItem from "../../components/ReviewListItem";

export default function Profile() {
  return (
    <div className="w-full py-4">
      <Head>
        <title>Profile | Barter Items at your Town</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col gap-6">
        {/* profile info */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:py-4">
          <div className="relative min-h-[150px] min-w-[150px] overflow-hidden rounded-full shadow-md">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
            <h1 className="text-3xl font-semibold">Current User</h1>
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4 md:whitespace-nowrap">
              <p className="text-gray-300">Joined in 2022</p>
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
          <div className="flex w-full gap-4 md:w-auto md:gap-8">
            <div className="flex w-full flex-col items-center gap-2 md:justify-center">
              <div className="flex items-center gap-2">
                <ArrowsHorizontal size={32} />
                <p className="text-2xl">8</p>
              </div>
              <p className="text-center font-display text-sm font-medium md:whitespace-nowrap">
                Bartered Items
              </p>
            </div>
            <div className="w-[1px] bg-green-500"></div>
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Need size={32} />
                <p className="text-2xl">10</p>
              </div>
              <p className="text-center font-display text-sm font-medium md:whitespace-nowrap">
                Offered Items
              </p>
            </div>
          </div>
        </div>
        {/* tabs */}
        <div className="w-full border-b border-gray-100">
          <Tabs className="flex flex-col">
            <div className="border-t border-t-gray-100">
              <TabList className="flex gap-4 md:gap-8">
                <Tab className="tab" selectedClassName="tab-active">
                  <p>Listings</p>
                  <span className="rounded-[10px] bg-gray-100 px-2 py-1 text-sm">
                    0
                  </span>
                </Tab>
                <Tab className="tab" selectedClassName="tab-active">
                  <p>Offered Items</p>
                  <span className="rounded-[10px] bg-gray-100 px-2 py-1 text-sm">
                    0
                  </span>
                </Tab>
              </TabList>
            </div>
            <div>
              <TabPanel>
                <div
                  className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 py-4 
           lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] lg:gap-6 lg:py-6"
                >
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/1/1"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description a very very very long description with a story of some sort"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                  <ItemCard
                    name="Product Test"
                    description="A valid product description"
                    offers={1}
                    time="7d"
                    to="/"
                  />
                </div>
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
                <StarFilled size={24} className="align-middle" /> 5.0
              </p>
              <p className="text-2xl text-gray-300">2 reviews</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">5</p>
                <ProgressBar
                  completed={100}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">4</p>
                <ProgressBar
                  completed={40}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">3</p>
                <ProgressBar
                  completed={30}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">2</p>
                <ProgressBar
                  completed={20}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <p className="w-[20px] text-lg">1</p>
                <ProgressBar
                  completed={10}
                  className="w-full"
                  baseBgColor="#E7F6D1"
                  bgColor="#85CB33"
                  isLabelVisible={false}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-[65%]">
            <ReviewList>
              <ReviewListItem />
              <ReviewListItem />
              <ReviewListItem />
            </ReviewList>
          </div>
        </div>
      </div>
    </div>
  );
}

Profile.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};