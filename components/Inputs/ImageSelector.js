import { useFilePicker } from "use-file-picker";
import { Image } from "@carbon/icons-react";
import ImageSelectorItem from "./ImageSelectorItem";
import { useCallback, useEffect, useMemo } from "react";
import { Information, Error } from "@carbon/icons-react";
import { memo } from "react";
import { useField } from "formik";

const MemoizedImageSelectorItem = memo(ImageSelectorItem, () => true);

export default function ImageSelector({ label, infoMessage, max, ...props }) {
  const [field, meta, helpers] = useField(props);
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: ["image/jpeg", "image/png", "image/gif"],
    multiple: true,
    // limitFilesConfig: { max: 10 },
    maxFileSize: 10,
  });

  const removeImage = useCallback(
    (image) => {
      const newSelected = meta.value.filter((img) => img !== image);
      // onChange(newSelected);
      helpers.setValue(newSelected);
    },
    [filesContent]
  );

  useEffect(() => {
    // onChange([...values, ...filesContent.slice(0, max - values.length)]);
    helpers.setValue([
      ...meta.value,
      ...filesContent.slice(0, max - meta.value.length),
    ]);
  }, [filesContent]);

  const selectedImages = meta.value.map((file, index) => (
    <MemoizedImageSelectorItem
      key={index}
      src={file.content}
      onRemove={() => removeImage(file)}
    />
  ));

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="font-display font-medium">{label}</p>}
      <div className="grid grid-cols-3 gap-2">
        {selectedImages}
        {meta.value.length < max && (
          <button
            onBlur={field.onBlur}
            id={props.name}
            type="button"
            onClick={() => openFileSelector()}
            className="flex aspect-square flex-col items-center justify-center overflow-hidden 
        rounded-[10px] bg-gray-100 p-2 font-body text-sm text-gray-300"
          >
            <Image size={32} /> Add Photo
          </button>
        )}
      </div>
      {infoMessage && (!meta.error || !meta.touched) && (
        <p className="flex gap-1 text-sm text-gray-200">
          <span>
            <Information size={16} />
          </span>
          {infoMessage}
        </p>
      )}
      {meta.error && meta.touched && (
        <p className="flex gap-1 text-sm text-danger-500">
          {/* <span>
            <Error size={16} className="-mt-[2px]" />
          </span> */}
          {meta.error}
        </p>
      )}
    </div>
  );
}
