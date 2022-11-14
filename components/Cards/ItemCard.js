import { Timer, Need } from "@carbon/icons-react";
import Image from "next/image";
import Link from "next/link";
import useCountdown from "../../lib/hooks/useCountdown";
import { AnimatePresence, motion } from "framer-motion";

export default function ItemCard({
  image,
  name,
  exchangeFor,
  duration,
  offers,
  to,
}) {
  const countdown = duration ? useCountdown(duration.endDate) : null;
  return (
    <Link href={to}>
      <a className="flex max-h-[400px] flex-col gap-2">
        <div className="relative aspect-square min-h-[150px] w-full overflow-hidden rounded-[10px]">
          <AnimatePresence>
            {countdown && (
              <motion.div
                className="justify-centers absolute top-0 right-0 z-10 m-2 flex items-center gap-1 rounded-[10px]
               bg-gray-400 px-2 py-1 text-white shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Timer size={16} />
                <p className="text-sm">
                  {countdown.days ? `${countdown.days}d` : ""}
                  {countdown.hours && !countdown.days
                    ? `${countdown.hours}h`
                    : ""}
                  {countdown.minutes && !countdown.hours && !countdown.days
                    ? `${countdown.minutes}m`
                    : ""}
                  {countdown.seconds &&
                  !countdown.minutes &&
                  !countdown.hours &&
                  !countdown.days
                    ? `${countdown.seconds}s`
                    : ""}
                  {countdown.seconds &&
                  !countdown.minutes &&
                  !countdown.hours &&
                  !countdown.days
                    ? `${countdown.seconds}s`
                    : ""}
                  {!countdown.seconds &&
                  !countdown.minutes &&
                  !countdown.hours &&
                  !countdown.days
                    ? "ended"
                    : ""}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            src={
              image
                ? image
                : "https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
            }
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="/images/placeholder.png"
          />
        </div>
        <div className="flex flex-col gap-1 text-gray-400">
          <p className="max-h-full overflow-hidden text-ellipsis whitespace-nowrap font-display font-semibold text-black-light">
            {name}
          </p>
          <p className="text-[15px] font-medium">Exchange for:</p>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px]">
            {exchangeFor}
          </p>
        </div>
        <div className="flex items-center gap-1 self-end text-black-light">
          <Need />
          <p className="font-display text-sm font-semibold">{offers}</p>
        </div>
      </a>
    </Link>
  );
}
