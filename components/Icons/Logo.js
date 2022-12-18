import Image from "next/image";

export default function Logo({ responsive, size }) {
  return (
    <span
      style={!responsive ? { width: `${size}px`, height: `${size}px` } : {}}
      className={`relative ${
        responsive || !size ? "h-[24px] w-[24px] md:h-[36px] md:w-[36px]" : ""
      }`}
    >
      <Image
        priority={true}
        src="/ebarteryan.svg"
        alt="ebarteryan logo"
        layout="fill"
      />
    </span>
  );
}
