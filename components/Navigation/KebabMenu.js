import { OverflowMenuVertical } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import { useState, useRef } from "react";
import useOnClickOutside from "../../lib/hooks/useOnClickOutside";
import ReactModal from "react-modal";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default function KebabMenu({ children }) {
  const menuRef = useRef(null);
  const listRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  useOnClickOutside(menuRef, () => setIsOpen(false));
  function showMenu(event) {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  }
  return (
    <div className="relative" ref={menuRef}>
      <CircleButton
        icon={<OverflowMenuVertical size={24} onClick={showMenu} />}
      />
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute right-0 z-10 mt-1 h-fit w-[200px] gap-1 rounded-[10px] bg-white
           p-1 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]"
        >
          {children}
        </ul>
      )}
    </div>
  );
}
