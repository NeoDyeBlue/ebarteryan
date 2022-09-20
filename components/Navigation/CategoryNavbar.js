import CategoryList from "../CategoryList";
import CategoryListItem from "../CategoryListItem";
import LocationBarterButtons from "../LocationBarterButtons";

export default function CategoryNavbar() {
  return (
    <div className="sticky top-[61px] z-50 w-full bg-white shadow-md lg:top-[75px]">
      <div className="container mx-auto flex flex-col lg:flex-row lg:gap-4">
        <div
          className="relative flex w-full overflow-hidden before:absolute before:left-0 before:z-50 before:block
         before:h-full before:w-4 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:block 
         after:h-full after:w-4 after:bg-gradient-to-l after:from-white after:to-transparent"
        >
          <CategoryList>
            <CategoryListItem to="/" name="All Items" />
            <CategoryListItem to="/" name="Appliances" />
            <CategoryListItem to="/" name="Automotive" />
            <CategoryListItem to="/" name="Clothings" />
            <CategoryListItem to="/" name="Electronics" />
            <CategoryListItem to="/" name="Furnitures" />
            <CategoryListItem to="/" name="Groceries" />
            <CategoryListItem to="/" name="Plants" />
            <CategoryListItem to="/" name="Others" />
          </CategoryList>
        </div>
        <LocationBarterButtons className="hidden w-full flex-row-reverse gap-4 py-4 lg:flex lg:max-w-[380px]" />
      </div>
    </div>
  );
}
