import { Error } from "@carbon/icons-react";

export default function ErrorScreen() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center gap-2 text-gray-200">
      <Error size={100} />
      <p className="text-lg">Something went wrong</p>
    </div>
  );
}
