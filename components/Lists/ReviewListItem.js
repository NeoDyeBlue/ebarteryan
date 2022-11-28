import Image from "next/image";

export default function ReviewListItem() {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-4 pb-6">
      <div className="relative h-[42px] w-[42px] overflow-hidden rounded-full">
        <Image
          src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
          layout="fill"
          alt="user image"
          // objectFit="cover"
        />
      </div>
      <div className="flex items-center">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <p className="font-display font-medium">Barterer Name</p>
          <p className="text-sm text-gray-400">1h ago</p>
        </div>
      </div>
      <p className="col-span-2 md:col-span-1 md:col-start-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Pellentesque eu
        tincidunt tortor aliquam nulla.
      </p>
    </li>
  );
}
