import { Add } from "@carbon/icons-react";
import ReactModal from "react-modal";
import { useRef, useState } from "react";
import { CircleButton, Button } from "../Buttons";
import { useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { FilterOption } from "../Misc";
import { useRouter } from "next/router";
import _ from "lodash";

export default function Modal({
  onClose,
  isOpen,
  onApply = () => {},
  options = [],
  initialValues = {},
}) {
  ReactModal.setAppElement("#__next");
  const modalRef = useRef();
  const router = useRouter();
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll(modalRef?.current, { reserveScrollBarGap: true });
    } else {
      enableBodyScroll(modalRef?.current);
    }
  }, [isOpen]);

  const [filterValues, setFilterValues] = useState({
    min: 0,
    max: 0,
    days_since_listed: [],
    condition: [],
  });
  useEffect(() => {
    setFilterValues((prev) => ({
      ...prev,
      ...(options.length
        ? Object.fromEntries(
            options.map((option) => [
              option.name.toLowerCase().split(" ").join("_"),
              [],
            ])
          )
        : {}),
      ...initialValues,
    }));
  }, []);

  const categoryOptions = options.map((option) => (
    <FilterOption
      label={option.name}
      key={option.name}
      type="badges"
      initialValue={
        filterValues[option.name.toLowerCase().split(" ").join("_")]
      }
      values={option.values}
      onChange={(value) =>
        setFilterValues((prev) => ({
          ...prev,
          [option.name.toLowerCase().split(" ").join("_")]: value,
        }))
      }
    />
  ));

  function handleApply() {
    onApply(_.omitBy(filterValues, _.isEmpty));
    // router.push(
    //   `${router.asPath.split("?")[0]}?${new URLSearchParams(
    //     _.omitBy(filterValues, _.isEmpty)
    //   ).toString()}`
    // );
    onClose();
  }

  function handlClear() {
    onApply({});
    onClose();
  }

  return (
    <ReactModal
      ref={modalRef}
      // contentLabel="Offer Modal"
      isOpen={isOpen}
      overlayClassName="bg-black/20 fixed top-0 z-50 flex h-full w-full items-end md:p-6 overflow-y-auto"
      preventScroll={true}
      onRequestClose={onClose}
      closeTimeoutMS={150}
      // bodyOpenClassName="modal-open-body"
      className="relative w-full overflow-hidden rounded-t-lg bg-white
     py-6 shadow-lg outline-none md:m-auto md:max-w-[480px] md:rounded-lg"
    >
      <div className="custom-scrollbar mx-auto max-h-[70vh] overflow-y-auto px-6 md:max-h-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <h1 className="font-display text-2xl font-semibold">Filter</h1>
            <CircleButton
              onClick={onClose}
              icon={<Add className="rotate-[135deg]" size={32} />}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
              <p className="font-display font-medium capitalize">
                Price Range Value
              </p>
              <div className="flex w-full items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filterValues.min}
                  min={0}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      min: e.target.value,
                    }))
                  }
                  className={`"border-gray-200 focus:ring-green-500" w-full rounded-[10px] 
    border bg-white p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1`}
                />
                <p>-</p>
                <input
                  type="number"
                  placeholder="Max"
                  value={filterValues.max}
                  min={filterValues.min}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      max: e.target.value,
                    }))
                  }
                  className={`"border-gray-200 focus:ring-green-500" w-full rounded-[10px] 
    border bg-white p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1`}
                />
              </div>
            </div>
            <FilterOption
              label="Condition"
              type="badges"
              initialValue={filterValues.condition}
              values={["new", "slightly used", "mostly used", "old", "broken"]}
              onChange={(value) =>
                setFilterValues((prev) => ({
                  ...prev,
                  condition: value,
                }))
              }
            />
            {categoryOptions}
            <FilterOption
              label="Days Since Listed"
              type="radio"
              initialValue={filterValues.days_since_listed}
              values={["All", "1", "7", "30"]}
              onChange={(value) =>
                setFilterValues((prev) => ({
                  ...prev,
                  days_since_listed: value,
                }))
              }
            />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={() => {
                handlClear();
              }}
              secondary={true}
            >
              Clear all
            </Button>
            <Button onClick={() => handleApply()}>Apply</Button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
