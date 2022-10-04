import ScrollContainer from "react-indiana-drag-scroll";

export default function CategoryList({ children }) {
  return (
    <ScrollContainer>
      <ul className="flex h-[60px] w-min gap-9 px-4 lg:h-full">{children}</ul>
    </ScrollContainer>
  );
}
