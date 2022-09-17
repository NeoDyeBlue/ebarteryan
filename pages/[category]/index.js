import NavLayout from "../../components/Layouts/NavLayout";
import CategoryLayout from "../../components/Layouts/CategoryLayout";

export default function Category() {
  return (
    <div className="container mx-auto flex items-center justify-center h-screen">
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
