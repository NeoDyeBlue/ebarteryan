import { NavLayout, CategoryLayout } from "../../components/Layouts";
import VerificationTemplate from "../../utils/email/templates/verification-template";

export default function Category() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <VerificationTemplate
        receiverName="User Name"
        verificationLink="http://localhost:3000"
      />
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
