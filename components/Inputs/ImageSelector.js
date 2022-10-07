import { useFilePicker } from "use-file-picker";
import { Image } from "@carbon/icons-react";
import ImageSelectorItem from "./ImageSelectorItem";
import { useState, useEffect, useCallback } from "react";
import { Information } from "@carbon/icons-react";

export default function ImageSelector({ label, infoMessage }) {
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: true,
    // limitFilesConfig: { max: 10 },
    maxFileSize: 50,
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log("re");
    setImages((prev) => [
      ...prev,
      ...filesContent.slice(0, 10 - images.length),
    ]);
  }, [filesContent]);

  const removeImage = (image) => {
    const newSelected = images.filter((img) => img !== image);
    setImages(newSelected);
  };

  const selectedImages = images.map((file, index) => (
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
        {images.length < 10 && (
          <button
            type="button"
            onClick={() => openFileSelector()}
            className="flex aspect-square flex-col items-center justify-center overflow-hidden 
        rounded-[10px] bg-gray-100 p-1 font-body text-sm text-gray-300"
          >
            <Image size={32} /> Add Photo
          </button>
        )}
      </div>
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
