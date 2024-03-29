import Image from "next/image";
import format from "date-fns/format";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";

export default function ReviewListItem({ review }) {
  return (
    <li className="flex flex-col-reverse gap-3 pb-6">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${review?.reviewer?._id}`}>
          <a className="relative h-[42px] w-[42px] overflow-hidden rounded-full">
            <Image
              src={review?.reviewer?.image?.url}
              layout="fill"
              alt="user image"
              // objectFit="cover"
            />
          </a>
        </Link>
        <p className="font-display font-medium">
          {review?.reviewer?.firstName} {review?.reviewer?.lastName}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-3 overflow-hidden md:gap-4">
          <Link href={`/items/${review?.item?._id}`}>
            <a className="relative h-[50px] w-[50px] flex-shrink-0 overflow-hidden rounded-[5px]">
              <Image
                src={review?.item?.image?.url}
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL="/images/placeholder.png"
                alt="thumbnail image"
              />
            </a>
          </Link>
          <div
            className="flex w-full max-w-full flex-col gap-1 overflow-hidden
                  md:flex-row md:justify-between md:gap-4"
          >
            <div className="flex flex-col">
              <p
                className="overflow-hidden overflow-ellipsis
              whitespace-nowrap font-display font-semibold"
              >
                {review?.item?.name}
              </p>
              <div className="flex items-center gap-2">
                <Rating
                  className="align-middle"
                  transition
                  // allowHalfIcon
                  fillColor="#85CB33"
                  emptyColor="#D2D2D2"
                  initialValue={review?.rate}
                  // ratingValue={5}
                  readonly
                  size={18}
                />
                <p className="text-sm text-gray-200">
                  {review?.item?.createdAt &&
                    format(new Date(review?.item?.createdAt), "PP")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="col-span-2 md:col-span-1 md:col-start-2">
          {review?.review}
        </p>
      </div>
    </li>
  );
}
