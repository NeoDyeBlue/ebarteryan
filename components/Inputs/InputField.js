export default function InputField({
  type,
  name,
  value,
  required,
  placeholder,
  onChange,
  label,
}) {
  return (
    <div className="flex flex-col gap-1">
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
    </div>
  );
}
