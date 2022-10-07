export default function InputField({
  type,
  name,
  value,
  required,
  placeholder,
  onChange,
  label,
  infoMessage,
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="font-display font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-gray-100 bg-white 
        p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
        onChange={onChange}
      ></input>
      {infoMessage && (
        <p className="flex gap-1 text-sm text-gray-200">
          <span>
            <Information size={16} />
          </span>
          {infoMessage}
        </p>
      )}
    </div>
  );
}
