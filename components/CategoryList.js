import ScrollContainer from "react-indiana-drag-scroll";

export default function CategoryList({ children }) {
  return (
    <ScrollContainer>
      <ul className="flex gap-9 px-4 h-[60px] lg:h-[80px] w-min">{children}</ul>
    </ScrollContainer>
  );
}
