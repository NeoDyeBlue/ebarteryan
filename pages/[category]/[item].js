import NavLayout from "../../components/Layouts/NavLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import Head from "next/head";
import {
  Location,
  Timer,
  Need,
  ArrowsHorizontal,
  Bookmark,
} from "@carbon/icons-react";
import Button from "../../components/Button";
import IconLabel from "../../components/IconLabel";
import { Rating } from "react-simple-star-rating";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OfferList from "../../components/OfferList";
import OfferListItem from "../../components/OfferListItem";

export default function Item() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Head>
        <title>Item Name | eBarterYan Category</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto flex max-w-[1000px] flex-col gap-4 md:gap-6">
        {/* Carousel and other info */}
        <div className="flex flex-col gap-6 border-b border-b-gray-100 pt-4 pb-6 md:grid md:grid-cols-2 md:gap-8 md:pt-8">
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            className="-mx-6 -mt-4 w-auto md:col-start-1 md:row-start-2 md:m-0 md:overflow-hidden md:rounded-[10px]
            "
          >
            <div className="relative aspect-square min-h-[200px] w-full">
              <Image
                src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="relative aspect-square min-h-[200px] w-full">
              <Image
                src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="relative aspect-square min-h-[200px] w-full">
              <Image
                src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="relative aspect-square min-h-[200px] w-full">
              <Image
                src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </Carousel>
          <div
            className="item-center flex w-full gap-2 text-ellipsis whitespace-nowrap font-display text-sm text-gray-300
          md:row-span-full md:row-start-1"
          >
            <p className="underline">Category</p>
            <p>&#62;</p>
            <p className="text-black-light">Item Name</p>
          </div>
          <div className="flex flex-col gap-4 md:col-start-2 md:row-start-2">
            <div className="flex flex-col gap-1 border-b border-b-gray-100 pb-6">
              <h1 className="text-2xl font-semibold md:text-3xl">Item Name</h1>
              <div className="break-words text-sm">
                <span className="mr-1 inline-block align-middle">
                  <Location size={16} />
                </span>
                <p className="inline">Pandi, Bulacan • September 17, 2022</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 pb-4">
              <h2 className="text-lg font-medium">Exchange for</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Pellentesque eu tincidunt tortor aliquam nulla.
              </p>
            </div>
            <div className="flex flex-col gap-4 pb-6">
              <div className="flex items-center justify-between rounded-[10px] border border-gray-100 p-4">
                <p className="font-display font-medium">Will end in</p>
                <div className="flex items-center gap-2">
                  <Timer size={24} />
                  <p className="text-lg">7d 3h 6m</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-[10px] border border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
                <p className="font-display font-medium">Claiming Options</p>
                <div className="flex gap-3">
                  <IconLabel>
                    <Location size={16} />
                    <p className="text-sm">Meet-up</p>
                  </IconLabel>
                  <IconLabel>
                    <Location size={16} />
                    <p className="text-sm">Delivery</p>
                  </IconLabel>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <Button>Offer Now</Button>
              <Button secondary={true}>
                <Bookmark size={20} /> Save
              </Button>
            </div>
          </div>
        </div>
        {/* Description and Barterer*/}
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="flex flex-col gap-2 border-b border-b-gray-100 pb-6 md:w-full md:border-0">
            <h2 className="text-lg font-medium">Description</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Pellentesque eu tincidunt tortor aliquam nulla.
            </p>
          </div>
          <div className="hidden w-[1px] bg-gray-100 md:block"></div>
          <div className="flex flex-col gap-4 md:w-3/5">
            <p className="font-display text-lg font-medium">Listed By</p>
            <div className="flex items-center justify-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <p className="font-display font-medium">Another User</p>
                <p className="text-xs">Joined in 2022</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-100 p-4">
              <p className="font-display text-sm font-medium">
                Barterer Rating
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
            </div>
            <div className="flex gap-4">
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <ArrowsHorizontal size={32} />
                  <p className="text-2xl">8</p>
                </div>
                <p className="text-center font-display text-sm font-medium">
                  Bartered Items
                </p>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <Need size={32} />
                  <p className="text-2xl">10</p>
                </div>
                <p className="text-center font-display text-sm font-medium">
                  Offered Items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full pb-6">
        <Tabs className="flex flex-col gap-6">
          <div className="border-y border-y-gray-100">
            <TabList className="mx-auto flex max-w-[1000px] gap-4 md:gap-8">
              <Tab className="tab" selectedClassName="tab-active">
                <p>Offers</p>
                <span className="rounded-[10px] bg-gray-100 px-2 py-1 text-sm">
                  0
                </span>
              </Tab>
              <Tab className="tab" selectedClassName="tab-active">
                <p>Questions</p>
                <span className="rounded-[10px] bg-gray-100 px-2 py-1 text-sm">
                  0
                </span>
              </Tab>
            </TabList>
          </div>
          <div className="mx-auto max-w-[1000px]">
            <TabPanel>
              <OfferList>
                <OfferListItem />
                <OfferListItem />
                <OfferListItem />
                <OfferListItem />
                <OfferListItem />
              </OfferList>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

Item.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
