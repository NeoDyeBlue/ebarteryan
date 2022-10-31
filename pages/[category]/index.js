import { NavLayout, CategoryLayout } from "../../components/Layouts";
import VerificationTemplate from "../../utils/email/templates/verification-template";

export default function Category() {
  return (
    <NavLayout>
      <CategoryLayout>
        <div className="container mx-auto flex h-screen items-center justify-center"></div>
      </CategoryLayout>
    </NavLayout>
  );
}

// Category.getLayout = function getLayout(page) {
//   return (
//     <NavLayout>
//       <CategoryLayout />
//       {page}
//     </NavLayout>
//   );
// };
