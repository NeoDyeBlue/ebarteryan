import { NavLayout, CategoryLayout } from "../../components/Layouts";

export default function Category() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      content
    </div>
  );
}

Category.getLayout = function getLayout(page) {
  return (
    <NavLayout>
      <CategoryLayout />
      {page}
    </NavLayout>
  );
};
