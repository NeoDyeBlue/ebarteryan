import useSWRInfinite from "swr/infinite";
import { useMemo } from "react";

/**
 * find a way to make this work
 * @param {*} key
 * @param {*} param1
 * @returns
 */

export default function usePaginate(url, limit, query, options) {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex += 1;
    if (previousPageData && !previousPageData.data) return null;
    if (query && Object.keys(query).length) {
      // console.log(pageIndex, query);
      return `${url}?${new URLSearchParams(
        query
      ).toString()}&page=${pageIndex}&limit=${limit}`;
    } else {
      return `${url}?page=${pageIndex}&limit=${limit}`;
    }
  };

  const {
    data: paginatedData,
    size,
    setSize,
    error,
    mutate,
    isValidating,
  } = useSWRInfinite(getKey, options);

  const cancel = () => {
    mutate(undefined, undefined, false);
  };

  const flattened = useMemo(() => {
    // return paginatedData &&
    //   paginatedData[paginatedData?.length - 1]?.data?.docs?.length
    //   ? paginatedData.map((page) => page.data.docs).flat()
    //   : [];
    return paginatedData
      ? paginatedData.map((page) => page?.data?.docs).flat()
      : [];
  }, [paginatedData]);

  const isEndReached =
    paginatedData &&
    paginatedData[paginatedData?.length - 1]?.data?.docs?.length < limit
      ? true
      : false;

  const isLoading = !paginatedData
    ? true
    : typeof paginatedData[size - 1] === undefined
    ? true
    : false;

  const totalDocs = paginatedData
    ? paginatedData[paginatedData?.length - 1]?.data?.totalDocs
    : 0;

  const finalData = useMemo(
    () => (flattened[0] !== undefined ? flattened : []),
    [flattened]
  );

  return {
    data: finalData,
    totalDocs,
    isEndReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
    isValidating,
    cancel,
  };
}
