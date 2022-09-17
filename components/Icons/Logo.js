import Image from "next/image";

export default function Logo() {
  return (
    <span className="relative w-[24px] h-[24px] md:w-[36px] md:h-[36px]">
      <Image src="/ebarteryan.svg" alt="ebarteryan logo" layout="fill" />
    </span>
  );
}
