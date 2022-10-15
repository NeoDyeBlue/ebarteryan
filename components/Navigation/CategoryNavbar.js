import CategoryList from "../CategoryList";
import CategoryListItem from "../CategoryListItem";
import LocationBarterButtons from "../LocationBarterButtons";

export default function CategoryNavbar() {
  return (
    <div className="sticky top-[57.25px] z-50 w-full bg-white shadow-md lg:top-[71.5px]">
      <div className="container mx-auto flex flex-col lg:flex-row lg:gap-4">
        <div
          className="relative flex w-full overflow-hidden before:absolute before:left-0 before:z-50 before:block
         before:h-full before:w-4 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:block 
         after:h-full after:w-4 after:bg-gradient-to-l after:from-white after:to-transparent"
        >
          <CategoryList>
            <CategoryListItem to="/" name="All Items" />
            <CategoryListItem to="/appliances" name="Appliances" />
            <CategoryListItem to="/automotive" name="Automotive" />
            <CategoryListItem to="/clothings" name="Clothings" />
            <CategoryListItem to="/electronics" name="Electronics" />
            <CategoryListItem to="/furnitures" name="Furnitures" />
            <CategoryListItem to="/groceries" name="Groceries" />
            <CategoryListItem to="/plants" name="Plants" />
            <CategoryListItem to="/others" name="Others" />
          </CategoryList>
        </div>
        <LocationBarterButtons className="hidden w-full flex-row-reverse gap-4 py-4 lg:flex lg:max-w-[380px]" />
      </div>
    </div>
  );
}
