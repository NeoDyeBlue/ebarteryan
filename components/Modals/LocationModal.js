import dynamic from "next/dynamic";
const LocationPicker = dynamic(() => import("../Inputs/LocationPicker"), {
  ssr: false,
});

export default function LocationModal() {
  return (
    <div>
      <LocationPicker />
    </div>
  );
}
