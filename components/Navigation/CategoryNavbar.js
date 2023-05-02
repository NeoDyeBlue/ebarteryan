import { CategoryList, CategoryListItem } from "../Lists";
import { LocationBarterButtons } from "../Buttons";
import useUiSizesStore from "../../store/useUiSizesStore";
import useSWR from "swr";
import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import _ from "lodash";

export default function CategoryNavbar() {
  const { data: categories, error } = useSWR("/api/categories");
  const { navbarHeight, setCategoryNavbarHeight } = useUiSizesStore();
  const router = useRouter();
  const { search_query } = router.query;

  const categoryNavbarRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      setCategoryNavbarHeight(
        categoryNavbarRef.current?.getBoundingClientRect().height
      );
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setCategoryNavbarHeight]);

  const categoryListItems =
    categories?.success &&
    _.sortBy(categories.data, "name").map((category, index) => {
      if (category.name !== "others") {
        return (
          <CategoryListItem
            key={index}
            to={`/${category.name.split(" ").join("+")}`}
            name={category.name}
          />
        );
      }
    });

  return (
    <div
      style={{ top: navbarHeight }}
      ref={categoryNavbarRef}
      className="sticky z-40 w-full bg-white shadow-md"
    >
      <div className="container mx-auto flex flex-col lg:flex-row lg:gap-4">
        {router.pathname == "/search" ? (
          <div className="flex min-h-[50px] w-full items-center overflow-hidden">
            <p className="overflow-hidden overflow-ellipsis whitespace-nowrap font-display font-medium">
              Search results for:{" "}
              <span className="font-normal">&quot;{search_query}&quot;</span>
            </p>
          </div>
        ) : (
          <div
            className="relative flex w-full overflow-hidden before:absolute before:left-0 before:z-50 before:block
           before:h-full before:w-4 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:block 
           after:h-full after:w-4 after:bg-gradient-to-l after:from-white after:to-transparent"
          >
            <CategoryList>
              <CategoryListItem to="/" name="All Items" aka={["/items"]} />
              {categoryListItems}
              <CategoryListItem to="/others" name="Others" />
            </CategoryList>
          </div>
        )}
        <LocationBarterButtons className="hidden w-full flex-row-reverse gap-4 py-4 lg:flex lg:max-w-[380px]" />
      </div>
    </div>
  );
}
