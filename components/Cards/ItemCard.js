import { Need, Bookmark, BookmarkFilled } from "@carbon/icons-react";
import Image from "next/image";
import Link from "next/link";
import { TrashCan } from "@carbon/icons-react";
import { ConfirmationModal } from "../Modals";
import { useState } from "react";
import { PopupLoader } from "../Loaders";
import { toast } from "react-hot-toast";

export default function ItemCard({
  id,
  image,
  name,
  exchangeFor,
  offers,
  to,
  isRemoved = false,
  violation = "",
  onAfterRemove = () => {},
}) {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteConfirmlick() {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result && result.success) {
        toast.success("Item deleted");
        onAfterRemove();
        setIsDeleting(false);
      } else {
        toast.error("Can't delete item");
      }
    } catch (error) {
      toast.error("Can't delete item");
      setIsDeleting(false);
    }
  }

  const children = (
    <a className="flex max-h-[400px] flex-col gap-2">
      <div className="relative aspect-square min-h-[150px] w-full overflow-hidden rounded-[10px]">
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="/images/placeholder.png"
          alt="item image"
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
      <Link href={`${to}#offers-questions`}>
        <a className="flex w-fit items-center gap-1 self-end rounded-md p-1 text-black-light hover:bg-gray-100/50">
          <Need />
          <p className="font-display text-sm font-semibold">{offers}</p>
        </a>
      </Link>
    </a>
  );

  if (!isRemoved) {
    return <Link href={to}>{children}</Link>;
  } else {
    return (
      <>
        <PopupLoader message="Deleting item" isOpen={isDeleting} />
        <ConfirmationModal
          isOpen={isConfirmDeleteOpen}
          label="Delete Unavailable Item?"
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={handleDeleteConfirmlick}
        />
        <div
          className="relative flex max-h-[400px] cursor-pointer flex-col gap-2
      overflow-hidden rounded-[10px] border border-gray-100 text-black-light"
          onClick={() => setIsConfirmDeleteOpen(true)}
        >
          <div className="h-full-w-full absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white p-4 text-center">
            <TrashCan size={32} />
            <div className="text-center">
              <p className="font-display font-semibold">{name}</p>
              <p className="text-sm">
                {violation && (
                  <span className="font-semibold capitalize">{violation}.</span>
                )}
                This item was not shown to other for its violation. Please
                refrain from posting such items.
              </p>
            </div>
          </div>
          {/* {children} */}
        </div>
      </>
    );
  }
}
