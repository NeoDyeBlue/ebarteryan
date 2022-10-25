import { useFilePicker } from "use-file-picker";
import { Image } from "@carbon/icons-react";
import ImageSelectorItem from "./ImageSelectorItem";
import { useEffect, useMemo } from "react";
import { Information, Error } from "@carbon/icons-react";
import React from "react";
import { useField } from "formik";

export default function ImageSelector({
  label,
  infoMessage,
  values,
  max,
  onChange,
  ...props
}) {
  const [field, meta] = useField(props);
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: ["image/jpeg", "image/png", "image/gif"],
    multiple: true,
    // limitFilesConfig: { max: 10 },
    maxFileSize: 10,
  });

  console.log(meta.error && meta.touched ? meta.error : "no");

  const removeImage = (image) => {
    const newSelected = values.filter((img) => img !== image);
    onChange(newSelected);
  };

  const images = useMemo(
    () => [...values, ...filesContent.slice(0, max - values.length)],
    [filesContent]
  );

  useEffect(() => {
    onChange(images);
  }, [filesContent]);

  const selectedImages = values.map((file, index) => (
    <ImageSelectorItem
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
        {values.length < max && (
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
      {infoMessage && !meta.error && (
        <p className="flex gap-1 text-sm text-gray-200">
          <span>
            <Information size={16} />
          </span>
          {infoMessage}
        </p>
      )}
      {meta.error && (
        <p className="flex gap-1 text-sm text-danger-500">
          <span>
            <Error size={16} className="-mt-[2px]" />
          </span>
          {JSON.stringify(meta.error)}
        </p>
      )}
    </div>
  );
}

export const MemoizedImageSelector = React.memo(ImageSelector);
