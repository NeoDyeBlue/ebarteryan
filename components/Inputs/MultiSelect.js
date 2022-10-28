import { Information } from "@carbon/icons-react";

export default function MultiSelect({ label, children, infoMessage, error }) {
  return (
    <fieldset className="flex flex-col gap-2">
      {label && (
        <legend className="mb-2 font-display font-medium">{label}</legend>
      )}
      <div className="flex flex-col gap-3">{children}</div>
      {infoMessage && !error && (
        <p className="flex gap-1 text-sm text-gray-200">
          <span>
            <Information size={16} />
          </span>
          {infoMessage}
        </p>
      )}
      {error && <p className="flex gap-1 text-sm text-danger-500">{error}</p>}
    </fieldset>
  );
}
