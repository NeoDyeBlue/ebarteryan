import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function RangeInput({
  label,
  defaultValue,
  value,
  min,
  max,
  onChange,
  disabled,
  valueEndText,
}) {
  return (
    <div>
      {label && <p className="mb-2 font-display font-medium">{label}</p>}
      <div className="flex items-center gap-4">
        <div className="w-full">
          <Slider
            min={min}
            max={max}
            defaultValue={defaultValue}
            value={value}
            disabled={disabled}
            onChange={onChange}
            handleStyle={{
              ...(disabled
                ? { backgroundColor: "#8F8F8F", borderColor: "#8F8F8F" }
                : { backgroundColor: "#85CB33", borderColor: "#85CB33" }),
            }}
            trackStyle={{
              backgroundColor: "#85CB33",
            }}
          />
        </div>
        <p>
          {value}
          {valueEndText}
        </p>
      </div>
    </div>
  );
}
