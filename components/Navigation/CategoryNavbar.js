import CategoryList from "../CategoryList";
import CategoryListItem from "../CategoryListItem";
import LocationBarterButtons from "../LocationBarterButtons";

export default function CategoryNavbar() {
  return (
    <div className="w-full shadow-md z-40 sticky top-[61px] lg:top-[75px] bg-white">
      <div className="container mx-auto lg:gap-4 flex flex-col lg:flex-row">
        <div
          className="relative flex before:block before:absolute before:w-4 before:left-0 before:h-full before:bg-gradient-to-r
         before:from-white before:to-transparent before:z-50 after:block after:absolute after:w-4 after:right-0 after:h-full 
         after:bg-gradient-to-l after:from-white after:to-transparent overflow-hidden w-full"
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
        <LocationBarterButtons className="hidden lg:flex gap-4 py-4 flex-row-reverse w-full lg:max-w-[380px]" />
      </div>
    </div>
  );
}
